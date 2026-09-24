"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, useTransition } from "react";
import { Download, Phone, Trash2 } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { deleteLead, updateLead } from "../actions";
import { Notice, Panel } from "./fields";

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  requirement: string | null;
  location: string | null;
  budget: string | null;
  message: string | null;
  property: string | null;
  source_page: string | null;
  lang: string | null;
  status: "new" | "contacted" | "closed" | "spam";
  notes: string | null;
  created_at: string;
};

const STATUSES = ["new", "contacted", "closed", "spam"] as const;
const PLACEHOLDER_EMAIL = "not-provided@example.com";

function csv(rows: Lead[]) {
  const cols: (keyof Lead)[] = ["created_at", "name", "phone", "email", "requirement", "property", "location", "budget", "message", "source_page", "lang", "status", "notes"];
  const cell = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  return [cols.join(","), ...rows.map((r) => cols.map((c) => cell(r[c])).join(","))].join("\n");
}

export default function LeadsPanel({ leads }: { leads: Lead[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | Lead["status"]>("all");
  const [pending, start] = useTransition();
  const [error, setError] = useState("");

  const counts = useMemo(() => Object.fromEntries(STATUSES.map((s) => [s, leads.filter((l) => l.status === s).length])), [leads]);
  const shown = filter === "all" ? leads.filter((l) => l.status !== "spam") : leads.filter((l) => l.status === filter);

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const r = await fn();
      setError(r.ok ? "" : r.error ?? "Something went wrong.");
      router.refresh();
    });

  function exportCsv() {
    const blob = new Blob(["﻿" + csv(shown)], { type: "text/csv;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `satyasri-leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  }

  return (
    <Panel
      title={`Leads (${leads.length})`}
      actions={
        <div className="flex flex-wrap gap-2">
          {(["all", ...STATUSES] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`pill !px-3.5 !py-2 !text-[12.5px] capitalize ${filter === s ? "!bg-char !text-paper" : ""}`}
            >
              {s === "all" ? "Inbox" : s} {s !== "all" ? `(${counts[s]})` : ""}
            </button>
          ))}
          <button type="button" onClick={exportCsv} className="btn btn-outline !min-h-9 !py-2 !text-[13px]">
            <Download size={14} aria-hidden /> CSV
          </button>
        </div>
      }
    >
      {error ? <div className="mb-4"><Notice kind="error">{error}</Notice></div> : null}
      {shown.length === 0 ? <p className="text-pewter">No leads here.</p> : null}
      <ul className={`grid gap-3 ${pending ? "opacity-60" : ""}`}>
        {shown.map((l) => {
          const when = new Date(l.created_at);
          const details = [
            ["Wants to", l.requirement],
            ["Property", l.property],
            ["Location", l.location],
            ["Budget", l.budget],
            ["Email", l.email && l.email !== PLACEHOLDER_EMAIL ? l.email : null],
            ["From", l.source_page],
          ].filter(([, v]) => v) as [string, string][];
          return (
            <li key={l.id} className={`rounded-[6px] border p-4 ${l.status === "new" ? "border-brand/50 bg-[#fff8f5]" : "border-mist"}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-[16px]">{l.name}</p>
                  <p className="mt-0.5 text-[12.5px] text-pewter">
                    {when.toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" })}
                    {l.lang && l.lang !== "en" ? ` · ${l.lang.toUpperCase()}` : ""}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a href={`tel:+91${l.phone}`} className="btn btn-outline !min-h-9 !px-3 !py-2 !text-[13px]"><Phone size={14} aria-hidden /> {l.phone}</a>
                  <a href={`https://wa.me/91${l.phone}`} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp !min-h-9 !px-3 !py-2 !text-[13px]"><WhatsAppIcon size={15} /> Chat</a>
                  <select
                    aria-label="Lead status"
                    value={l.status}
                    onChange={(e) => run(() => updateLead(l.id, { status: e.target.value }))}
                    className="field !min-h-9 !w-auto !py-1.5 !text-[13px] capitalize"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    type="button"
                    aria-label="Delete lead"
                    onClick={() => confirm(`Delete the lead from ${l.name}?`) && run(() => deleteLead(l.id))}
                    className="grid size-9 place-items-center rounded text-brand-deep hover:bg-mist"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              {details.length ? (
                <dl className="mt-3 grid gap-x-6 gap-y-1 text-[13.5px] sm:grid-cols-2">
                  {details.map(([k, v]) => (
                    <div key={k} className="flex gap-2"><dt className="text-pewter">{k}:</dt><dd className="min-w-0 break-words">{v}</dd></div>
                  ))}
                </dl>
              ) : null}
              {l.message ? <p className="mt-3 whitespace-pre-wrap rounded bg-mist-soft p-3 text-[14px]">{l.message}</p> : null}
              <textarea
                defaultValue={l.notes ?? ""}
                placeholder="Private notes…"
                rows={1}
                onBlur={(e) => e.target.value !== (l.notes ?? "") && run(() => updateLead(l.id, { notes: e.target.value }))}
                className="field mt-3 !min-h-10 resize-y !py-2 !text-[13.5px]"
              />
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}
