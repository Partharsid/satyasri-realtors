import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { JWT } from "google-auth-library";
import { serviceClient } from "@/lib/supabase/clients";
import { SITE } from "@/lib/site";

// ── Rate limit: 5 submissions / 10 min per IP (in-memory, single instance) ──
const hits = new Map<string, number[]>();
const WINDOW = 10 * 60_000;
const MAX = 5;

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX;
}

const REQUIREMENTS = ["buy", "rent", "sell", "rentOut", "lease", "invest"] as const;
const REQUIREMENT_LABEL: Record<(typeof REQUIREMENTS)[number], string> = {
  buy: "Buy",
  rent: "Rent (tenant)",
  sell: "Sell property",
  rentOut: "Rent out property",
  lease: "Lease",
  invest: "Invest",
};

const text = (max: number) => z.string().trim().max(max).optional().default("");

const Lead = z.object({
  name: z.string().trim().min(2).max(80),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  email: z.union([z.literal(""), z.string().trim().email().max(120)]).optional().default(""),
  requirement: z.enum(REQUIREMENTS).catch("buy"),
  location: text(80),
  budget: text(60),
  message: text(1000),
  property: text(200),
  source: text(120),
  lang: z.enum(["en", "te", "hi"]).catch("en"),
  company: z.string().max(0).optional(), // honeypot
});
type Lead = z.infer<typeof Lead>;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function rows(l: Lead): [string, string][] {
  return [
    ["Name", l.name],
    ["Phone", `+91 ${l.phone}`],
    ["Wants to", REQUIREMENT_LABEL[l.requirement]],
    ["Property", l.property],
    ["Location", l.location],
    ["Budget", l.budget],
    ["Email", l.email],
    ["Message", l.message],
    ["Page", l.source],
    ["Language", l.lang],
  ].filter(([, v]) => v) as [string, string][];
}

// ── Channels ────────────────────────────────────────────────────────────────
async function saveToSupabase(l: Lead) {
  const { error } = await serviceClient().from("leads").insert({
    name: l.name,
    phone: l.phone,
    email: l.email || null,
    requirement: REQUIREMENT_LABEL[l.requirement],
    location: l.location || null,
    budget: l.budget || null,
    message: l.message || null,
    property: l.property || null,
    source_page: l.source || null,
    lang: l.lang,
    status: "new",
  });
  if (error) throw new Error(`supabase: ${error.message}`);
}

async function sendTelegram(l: Lead) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chat = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chat) throw new Error("telegram: not configured");
  const body =
    `<b>🏠 New enquiry — ${esc(SITE.name)}</b>\n\n` +
    rows(l).map(([k, v]) => `<b>${k}:</b> ${esc(v)}`).join("\n") +
    `\n\n<a href="https://wa.me/91${l.phone}">WhatsApp ${esc(l.name)}</a> · <a href="tel:+91${l.phone}">Call</a>`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text: body, parse_mode: "HTML", disable_web_page_preview: true }),
  });
  if (!res.ok) throw new Error(`telegram: ${res.status} ${await res.text()}`);
}

async function appendToSheet(l: Lead) {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  const sheet = process.env.GOOGLE_SHEET_ID;
  if (!email || !key || !sheet) throw new Error("sheets: not configured");
  const jwt = new JWT({ email, key, scopes: ["https://www.googleapis.com/auth/spreadsheets"] });
  const { token } = await jwt.getAccessToken();
  const range = encodeURIComponent(process.env.GOOGLE_SHEET_RANGE || "Sheet1!A:L");
  const stamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
  // Column order keeps the original sheet's first 8 columns and appends new ones.
  const values = [[stamp, l.name, l.phone, l.email, l.message, l.property, l.source, "satyasri.com", REQUIREMENT_LABEL[l.requirement], l.location, l.budget, l.lang]];
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${sheet}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ values }) },
  );
  if (!res.ok) throw new Error(`sheets: ${res.status} ${await res.text()}`);
}

async function sendEmail(l: Lead) {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.RESEND_TO;
  if (!key || !from || !to) throw new Error("email: not configured");
  const table = rows(l)
    .map(([k, v]) => `<tr><td style="padding:8px 12px;color:#666;white-space:nowrap;vertical-align:top">${k}</td><td style="padding:8px 12px;color:#000">${esc(v)}</td></tr>`)
    .join("");
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: to.split(",").map((s) => s.trim()),
      subject: `New enquiry: ${l.name} — ${REQUIREMENT_LABEL[l.requirement]}${l.property ? ` · ${l.property}` : ""}`,
      reply_to: l.email || undefined,
      html: `<div style="font-family:Helvetica,Arial,sans-serif;font-size:14px"><h2 style="font-weight:400;margin:0 0 16px">New enquiry from satyasri.com</h2><table style="border-collapse:collapse">${table}</table><p style="margin-top:20px"><a href="https://wa.me/91${l.phone}" style="color:#c2410c">WhatsApp ${esc(l.name)}</a></p></div>`,
    }),
  });
  if (!res.ok) throw new Error(`email: ${res.status} ${await res.text()}`);
}

// ── Handler ─────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("cf-connecting-ip") || req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (limited(ip)) return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
  }

  const parsed = Lead.safeParse(json);
  if (!parsed.success) {
    // A filled honeypot fails validation too — answer the same way as success so bots learn nothing.
    if (typeof (json as { company?: unknown })?.company === "string" && (json as { company: string }).company) {
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 422 });
  }

  const lead = parsed.data;
  const results = await Promise.allSettled([saveToSupabase(lead), sendTelegram(lead), appendToSheet(lead), sendEmail(lead)]);
  const names = ["supabase", "telegram", "sheets", "email"];
  results.forEach((r, i) => r.status === "rejected" && console.error(`[lead] ${names[i]} failed:`, (r.reason as Error)?.message));

  const delivered = results.some((r) => r.status === "fulfilled");
  if (!delivered) console.error("[lead] ALL channels failed — lead:", JSON.stringify(lead));
  return NextResponse.json({ ok: delivered }, { status: delivered ? 200 : 502 });
}
