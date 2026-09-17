import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// ── Rate limiting (simple in-memory store — resets on cold start) ─────────────
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 5;       // max submissions
const RATE_LIMIT_WINDOW = 60_000; // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX;
}

// ── Input validation schema ───────────────────────────────────────────────────
const schema = z.object({
  name: z.string().min(2).max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Invalid phone"),
  email: z.string().email(),
  property: z.string().max(200).optional().default(""),
  message: z.string().min(5).max(1000),
  sourcePage: z.string().max(100).optional().default(""),
  // Honeypot — must be empty; if filled, it's a bot
  _hp: z.string().max(0).optional(),
});

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Append a row to the configured Google Sheet */
async function sendToGoogleSheets(data: z.infer<typeof schema>): Promise<void> {
  const { google } = await import("googleapis");

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });
  const spreadsheetId = process.env.GOOGLE_SHEET_ID!;

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A:H",
    valueInputOption: "RAW",
    requestBody: {
      values: [
        [
          new Date().toISOString(),
          data.name,
          data.phone,
          data.email,
          data.message,
          data.property,
          data.sourcePage,
          "satyasri.com",
        ],
      ],
    },
  });
}

/** Send an email notification via Resend */
async function sendEmail(data: z.infer<typeof schema>): Promise<void> {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  const toEmail = process.env.EMAIL_TO || "mahesh@satyasri.com";

  await resend.emails.send({
    from: `Satyasri Realtors Website <noreply@${process.env.RESEND_FROM_DOMAIN || "satyasri.com"}>`,
    to: toEmail,
    subject: `New Lead: ${data.name} — ${data.property || "General Enquiry"}`,
    html: `
      <h2 style="color:#0f2d5c;font-family:sans-serif;">New Lead from Satyasri Realtors Website</h2>
      <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%;">
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Name</td><td style="padding:8px;">${data.name}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Phone</td><td style="padding:8px;">${data.phone}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Email</td><td style="padding:8px;">${data.email}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Property</td><td style="padding:8px;">${data.property || "—"}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Message</td><td style="padding:8px;">${data.message}</td></tr>
        <tr style="background:#f9f9f9;"><td style="padding:8px;font-weight:bold;color:#666;">Source Page</td><td style="padding:8px;">${data.sourcePage || "—"}</td></tr>
        <tr><td style="padding:8px;font-weight:bold;color:#666;">Timestamp</td><td style="padding:8px;">${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</td></tr>
      </table>
      <p style="font-family:sans-serif;font-size:12px;color:#999;margin-top:16px;">Sent from satyasri.com lead capture form</p>
    `,
  });
}

/** Send a formatted message to a Telegram bot */
async function sendTelegram(data: z.infer<typeof schema>): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN!;
  const chatId = process.env.TELEGRAM_CHAT_ID!;
  const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

  const text =
    `🏠 *New Lead — Satyasri Realtors*\n\n` +
    `👤 *Name:* ${data.name}\n` +
    `📱 *Phone:* ${data.phone}\n` +
    `✉️ *Email:* ${data.email}\n` +
    `🏘️ *Property:* ${data.property || "—"}\n` +
    `💬 *Message:* ${data.message}\n` +
    `📍 *Source:* ${data.sourcePage || "—"}\n` +
    `🕐 *Time:* ${timestamp} IST`;

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown" }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Telegram error: ${err}`);
  }
}

// ── Route handler ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  // Get client IP for rate limiting
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  // Parse and validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body." }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed.", issues: parsed.error.flatten() },
      { status: 422 }
    );
  }

  // Honeypot check
  if (parsed.data._hp && parsed.data._hp.length > 0) {
    // Bot detected — return 200 to avoid fingerprinting
    return NextResponse.json({ ok: true });
  }

  const data = parsed.data;

  // Fire all three channels in parallel; one failing must not block the others
  const [sheetsResult, emailResult, telegramResult] = await Promise.allSettled([
    process.env.GOOGLE_SHEET_ID ? sendToGoogleSheets(data) : Promise.reject(new Error("GOOGLE_SHEET_ID not set")),
    process.env.RESEND_API_KEY ? sendEmail(data) : Promise.reject(new Error("RESEND_API_KEY not set")),
    process.env.TELEGRAM_BOT_TOKEN ? sendTelegram(data) : Promise.reject(new Error("TELEGRAM_BOT_TOKEN not set")),
  ]);

  // Log any channel failures server-side
  if (sheetsResult.status === "rejected")
    console.error("[Lead] Google Sheets failed:", sheetsResult.reason);
  if (emailResult.status === "rejected")
    console.error("[Lead] Email failed:", emailResult.reason);
  if (telegramResult.status === "rejected")
    console.error("[Lead] Telegram failed:", telegramResult.reason);

  // At least one channel succeeded → show success to user
  const anySucceeded = [sheetsResult, emailResult, telegramResult].some(
    (r) => r.status === "fulfilled"
  );

  if (anySucceeded) {
    return NextResponse.json({ ok: true });
  }

  // All three failed
  console.error("[Lead] ALL channels failed for submission:", data);
  return NextResponse.json(
    {
      ok: false,
      error:
        "We couldn't process your submission right now. Please call +91 90142 24408 or WhatsApp us directly.",
    },
    { status: 500 }
  );
}
