"use client";

import { useId, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { WhatsAppIcon } from "./icons";
import type { Dictionary } from "@/lib/i18n/dictionaries/en";

type Props = {
  t: Dictionary["form"];
  lang: string;
  source: string;
  areas: string[];
  otherAreasLabel: string;
  whatsapp: string;
  property?: string;
  defaultRequirement?: string;
  tone?: "light" | "dark";
  /** Single column — for narrow sidebars. */
  stack?: boolean;
};

type Status = "idle" | "sending" | "done" | "error";

export default function LeadForm({ t, lang, source, areas, otherAreasLabel, whatsapp, property, defaultRequirement = "buy", tone = "light", stack = false }: Props) {
  const id = useId();
  const [status, setStatus] = useState<Status>("idle");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
    const phone = (data.phone || "").replace(/\D/g, "").replace(/^(91|0)(?=\d{10}$)/, "");

    const next: typeof errors = {};
    if ((data.name || "").trim().length < 2) next.name = t.invalidName;
    if (!/^[6-9]\d{9}$/.test(phone)) next.phone = t.invalidPhone;
    setErrors(next);
    if (Object.keys(next).length) {
      form.querySelector<HTMLInputElement>(next.name ? "[name=name]" : "[name=phone]")?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, phone, lang, source, property: property ?? "" }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const dark = tone === "dark";
  const span = stack ? "" : "sm:col-span-2";
  const fieldCls = `field ${dark ? "!bg-iron !border-iron !text-paper placeholder:!text-smoke hover:!border-smoke focus:!border-paper" : ""}`;
  const labelCls = `mb-1.5 block text-[13px] ${dark ? "text-mist/85" : "text-pewter"}`;

  if (status === "done") {
    return (
      <div role="status" className={`rounded-card p-6 ${dark ? "bg-iron text-paper" : "bg-mist-soft"}`}>
        <CheckCircle2 size={28} strokeWidth={1.4} className="text-brand" aria-hidden />
        <p className="mt-4 text-[17px]">{t.success}</p>
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp mt-5">
          <WhatsAppIcon size={17} /> {t.successWhatsapp}
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className={`grid gap-4 ${stack ? "" : "sm:grid-cols-2"}`}>
      {/* Honeypot — hidden from people, tempting for bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div>
        <label htmlFor={`${id}-name`} className={labelCls}>{t.name}</label>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          maxLength={80}
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? `${id}-name-err` : undefined}
          className={fieldCls}
        />
        {errors.name ? <p id={`${id}-name-err`} className="mt-1 text-[12px] text-brand-deep">{errors.name}</p> : null}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className={labelCls}>{t.phone}</label>
        <div className="relative">
          <span className={`pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] ${dark ? "text-smoke" : "text-pewter"}`}>+91</span>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            required
            maxLength={14}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? `${id}-phone-err` : undefined}
            className={`${fieldCls} !pl-12`}
          />
        </div>
        {errors.phone ? <p id={`${id}-phone-err`} className="mt-1 text-[12px] text-brand-deep">{errors.phone}</p> : null}
      </div>

      <div>
        <label htmlFor={`${id}-req`} className={labelCls}>{t.requirement}</label>
        <select id={`${id}-req`} name="requirement" defaultValue={defaultRequirement} className={fieldCls}>
          {Object.entries(t.requirements).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-loc`} className={labelCls}>{t.location}</label>
        <select id={`${id}-loc`} name="location" defaultValue="" className={fieldCls}>
          <option value="">—</option>
          {areas.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
          <option value="Other">{otherAreasLabel}</option>
        </select>
      </div>

      <div>
        <label htmlFor={`${id}-budget`} className={labelCls}>{t.budget}</label>
        <input id={`${id}-budget`} name="budget" maxLength={60} className={fieldCls} />
      </div>

      <div>
        <label htmlFor={`${id}-email`} className={labelCls}>{t.email}</label>
        <input id={`${id}-email`} name="email" type="email" autoComplete="email" maxLength={120} className={fieldCls} />
      </div>

      <div className={span}>
        <label htmlFor={`${id}-msg`} className={labelCls}>{t.message}</label>
        <textarea id={`${id}-msg`} name="message" rows={3} maxLength={1000} placeholder={t.messagePlaceholder} className={`${fieldCls} resize-y`} />
      </div>

      <div className={`flex flex-col gap-3 ${span} ${stack ? "" : "sm:flex-row sm:items-center sm:justify-between"}`}>
        <p className={`text-[12px] ${dark ? "text-smoke" : "text-pewter"}`}>{t.privacy}</p>
        <button type="submit" disabled={status === "sending"} className={`btn ${dark ? "bg-paper text-ink hover:bg-mist" : "btn-dark"} shrink-0`}>
          {status === "sending" ? t.sending : t.submit}
          <ArrowRight size={16} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      {status === "error" ? (
        <p role="alert" className={`text-[14px] ${span} ${dark ? "text-brand" : "text-brand-deep"}`}>
          {t.error}{" "}
          <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2">WhatsApp</a>
        </p>
      ) : null}
    </form>
  );
}
