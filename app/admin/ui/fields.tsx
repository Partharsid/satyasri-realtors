"use client";

import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, ImagePlus, Loader2, Star, Trash2 } from "lucide-react";
import { uploadImage } from "@/lib/supabase/browser";

export function Field({ label, hint, children, wide = false }: { label: string; hint?: string; children: ReactNode; wide?: boolean }) {
  return (
    <label className={`grid content-start gap-1.5 ${wide ? "sm:col-span-2 lg:col-span-3" : ""}`}>
      <span className="text-[12px] font-medium text-pewter">{label}</span>
      {children}
      {hint ? <span className="text-[11.5px] text-pewter/80">{hint}</span> : null}
    </label>
  );
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-[14px]">
      <span className="relative inline-flex">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="peer sr-only" />
        <span className="h-6 w-11 rounded-full bg-mist transition-colors peer-checked:bg-char peer-focus-visible:outline-2 peer-focus-visible:outline-brand" />
        <span className="absolute left-0.5 top-0.5 size-5 rounded-full bg-paper shadow transition-transform peer-checked:translate-x-5" />
      </span>
      {label}
    </label>
  );
}

export function Panel({ title, actions, children }: { title: string; actions?: ReactNode; children: ReactNode }) {
  return (
    <section className="rounded-card bg-paper p-5 md:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-[18px] font-normal">{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

export function Notice({ kind, children }: { kind: "error" | "ok"; children: ReactNode }) {
  return (
    <p role={kind === "error" ? "alert" : "status"} className={`rounded-[6px] px-3 py-2 text-[13px] ${kind === "error" ? "bg-[#fdecea] text-brand-deep" : "bg-[#e7f5ec] text-[#166534]"}`}>
      {children}
    </p>
  );
}

/** Ordered image list with upload; the first image is the cover. */
export function ImageManager({ images, onChange, folder }: { images: string[]; onChange: (next: string[]) => void; folder: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setError("");
    const added: string[] = [];
    for (const f of Array.from(files)) {
      if (!f.type.startsWith("image/")) continue;
      if (f.size > 15 * 1024 * 1024) {
        setError(`${f.name} is larger than 15 MB.`);
        continue;
      }
      try {
        added.push(await uploadImage(f, folder));
      } catch (e) {
        setError(`Upload failed: ${(e as Error).message}`);
      }
    }
    onChange([...images, ...added]);
    setBusy(false);
    if (input.current) input.current.value = "";
  }

  const move = (i: number, d: -1 | 1) => {
    const next = [...images];
    [next[i], next[i + d]] = [next[i + d], next[i]];
    onChange(next);
  };

  return (
    <div className="grid gap-3">
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {images.map((src, i) => (
          <li key={src + i} className="overflow-hidden rounded-[6px] border border-mist bg-mist-soft">
            <div className="relative aspect-[4/3]">
              <Image src={src} alt="" fill sizes="200px" className="object-cover" unoptimized={src.startsWith("http")} />
              {i === 0 ? <span className="pill absolute left-1.5 top-1.5 !bg-char !text-paper"><Star size={11} aria-hidden /> Cover</span> : null}
            </div>
            <div className="flex items-center justify-between p-1.5">
              <div className="flex">
                <button type="button" aria-label="Move left" disabled={i === 0} onClick={() => move(i, -1)} className="grid size-8 place-items-center rounded hover:bg-mist disabled:opacity-30"><ArrowLeft size={14} /></button>
                <button type="button" aria-label="Move right" disabled={i === images.length - 1} onClick={() => move(i, 1)} className="grid size-8 place-items-center rounded hover:bg-mist disabled:opacity-30"><ArrowRight size={14} /></button>
              </div>
              <button type="button" aria-label="Remove image" onClick={() => onChange(images.filter((_, j) => j !== i))} className="grid size-8 place-items-center rounded text-brand-deep hover:bg-mist"><Trash2 size={14} /></button>
            </div>
          </li>
        ))}
        <li>
          <button
            type="button"
            onClick={() => input.current?.click()}
            disabled={busy}
            className="grid aspect-[4/3] w-full place-items-center rounded-[6px] border border-dashed border-smoke text-[13px] text-pewter hover:border-ink hover:text-ink"
          >
            <span className="grid justify-items-center gap-1.5">
              {busy ? <Loader2 size={20} className="animate-spin" /> : <ImagePlus size={20} strokeWidth={1.5} />}
              {busy ? "Uploading…" : "Add photos"}
            </span>
          </button>
        </li>
      </ul>
      <input ref={input} type="file" accept="image/*" multiple hidden onChange={(e) => onFiles(e.target.files)} />
      {error ? <Notice kind="error">{error}</Notice> : null}
    </div>
  );
}

/** One-per-line list editor for features / amenities. */
export function LinesField({ value, onChange, placeholder }: { value: string[]; onChange: (v: string[]) => void; placeholder?: string }) {
  return (
    <textarea
      className="field min-h-32 resize-y"
      value={value.join("\n")}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value.split("\n").map((s) => s.trimStart()))}
      onBlur={(e) => onChange(e.target.value.split("\n").map((s) => s.trim()).filter(Boolean))}
    />
  );
}
