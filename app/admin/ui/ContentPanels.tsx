"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import Markdown from "react-markdown";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/slug";
import { deletePost, deleteReview, savePost, saveReview, saveSettings, type PostInput, type ReviewInput } from "../actions";
import { Field, ImageManager, Notice, Panel, Toggle } from "./fields";

type Msg = { kind: "ok" | "error"; text: string } | null;

// ── Journal ────────────────────────────────────────────────────────────────
export type Post = { id: string; slug: string; title: string; excerpt: string | null; content: string; cover: string | null; published: boolean; published_at: string | null };

export function PostsPanel({ posts }: { posts: Post[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<PostInput | null>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, start] = useTransition();

  if (editing) {
    return (
      <PostEditor
        initial={editing}
        onDone={(text) => {
          setEditing(null);
          if (text) setMsg({ kind: "ok", text });
          router.refresh();
        }}
      />
    );
  }

  return (
    <Panel
      title={`Journal (${posts.length})`}
      actions={
        <button type="button" onClick={() => setEditing({ title: "", slug: "", excerpt: "", content: "", cover: "", published: false })} className="btn btn-dark">
          <Plus size={16} aria-hidden /> New article
        </button>
      }
    >
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      <ul className={`grid gap-2 ${pending ? "opacity-60" : ""}`}>
        {posts.map((p) => (
          <li key={p.id} className="grid grid-cols-[72px_1fr_auto] items-center gap-3 rounded-[6px] border border-mist p-2">
            <div className="relative aspect-[4/3] overflow-hidden rounded bg-mist">
              {p.cover ? <Image src={p.cover} alt="" fill sizes="72px" className="object-cover" unoptimized={p.cover.startsWith("http")} /> : null}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px]">{p.title}</p>
              <p className="text-[12.5px] text-pewter">{p.published ? `Published ${p.published_at ? new Date(p.published_at).toLocaleDateString("en-IN") : ""}` : "Draft"}</p>
            </div>
            <div className="flex">
              {p.published ? (
                <a href={`/en/blog/${p.slug}`} target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded hover:bg-mist" aria-label="View"><ExternalLink size={15} /></a>
              ) : null}
              <button type="button" onClick={() => setEditing({ id: p.id, title: p.title, slug: p.slug, excerpt: p.excerpt ?? "", content: p.content, cover: p.cover ?? "", published: p.published })} className="grid size-9 place-items-center rounded hover:bg-mist" aria-label="Edit"><Pencil size={15} /></button>
              <button
                type="button"
                onClick={() =>
                  confirm(`Delete “${p.title}”?`) &&
                  start(async () => {
                    const r = await deletePost(p.id);
                    setMsg(r.ok ? { kind: "ok", text: "Article deleted." } : { kind: "error", text: r.error });
                    router.refresh();
                  })
                }
                className="grid size-9 place-items-center rounded text-brand-deep hover:bg-mist"
                aria-label="Delete"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function PostEditor({ initial, onDone }: { initial: PostInput; onDone: (msg?: string) => void }) {
  const [v, setV] = useState<PostInput>(initial);
  const [preview, setPreview] = useState(false);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await savePost(v);
          if (r.ok) onDone("Article saved.");
          else setError(r.error);
        });
      }}
    >
      <Panel
        title={initial.id ? "Edit article" : "New article"}
        actions={
          <div className="flex items-center gap-3">
            <Toggle checked={v.published} onChange={(x) => setV({ ...v, published: x })} label="Published" />
            <button type="button" onClick={() => onDone()} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={pending} className="btn btn-dark">{pending ? "Saving…" : "Save"}</button>
          </div>
        }
      >
        {error ? <div className="mb-4"><Notice kind="error">{error}</Notice></div> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Title" wide><input className="field" required value={v.title} onChange={(e) => setV({ ...v, title: e.target.value })} /></Field>
          <Field label="URL slug" hint={`/en/blog/${slugify(v.slug || v.title) || "…"}`}><input className="field" value={v.slug ?? ""} placeholder="auto from title" onChange={(e) => setV({ ...v, slug: e.target.value })} /></Field>
          <Field label="Excerpt (shown on cards & Google)" wide><textarea className="field" rows={2} value={v.excerpt ?? ""} onChange={(e) => setV({ ...v, excerpt: e.target.value })} /></Field>
          <Field label="Cover image" wide>
            <ImageManager images={v.cover ? [v.cover] : []} onChange={(imgs) => setV({ ...v, cover: imgs[imgs.length - 1] ?? "" })} folder="blog" />
          </Field>
        </div>
        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[12px] font-medium text-pewter">Article (Markdown: ## Heading, **bold**, - list)</span>
            <button type="button" onClick={() => setPreview((p) => !p)} className="pill !py-1.5">{preview ? "Edit" : "Preview"}</button>
          </div>
          {preview ? (
            <div className="prose-gallery min-h-[420px] rounded-[6px] border border-mist p-6"><Markdown>{v.content}</Markdown></div>
          ) : (
            <textarea className="field min-h-[420px] font-mono !text-[14px]" value={v.content} onChange={(e) => setV({ ...v, content: e.target.value })} />
          )}
        </div>
      </Panel>
    </form>
  );
}

// ── Reviews ────────────────────────────────────────────────────────────────
export type ReviewRow = { id: string; author: string; body: string; rating: number; year: number | null; visible: boolean; sort_order: number };

export function ReviewsPanel({ reviews }: { reviews: ReviewRow[] }) {
  const router = useRouter();
  const [draft, setDraft] = useState<ReviewInput | null>(null);
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, start] = useTransition();

  const save = (r: ReviewInput) =>
    start(async () => {
      const res = await saveReview(r);
      setMsg(res.ok ? { kind: "ok", text: "Review saved." } : { kind: "error", text: res.error });
      if (res.ok) setDraft(null);
      router.refresh();
    });

  return (
    <Panel
      title={`Reviews (${reviews.length})`}
      actions={
        <button type="button" onClick={() => setDraft({ author: "", body: "", rating: 5, year: new Date().getFullYear(), visible: true, sort_order: reviews.length + 1 })} className="btn btn-dark">
          <Plus size={16} aria-hidden /> Add review
        </button>
      }
    >
      <p className="mb-4 text-[13px] text-pewter">Copy reviews word-for-word from the Google Business Profile. Hidden reviews stay here but don&apos;t show on the site.</p>
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {draft ? <ReviewForm value={draft} onSave={save} onCancel={() => setDraft(null)} pending={pending} /> : null}
      <ul className={`mt-3 grid gap-2 ${pending ? "opacity-60" : ""}`}>
        {reviews.map((r) => (
          <li key={r.id} className="rounded-[6px] border border-mist p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-[14.5px]">
                {r.author} · {"★".repeat(r.rating)} {r.year ? `· ${r.year}` : ""} {r.visible ? "" : "· hidden"}
              </p>
              <div className="flex items-center gap-2">
                <Toggle checked={r.visible} onChange={(x) => save({ ...r, visible: x })} label="Visible" />
                <button type="button" onClick={() => setDraft({ ...r })} className="grid size-9 place-items-center rounded hover:bg-mist" aria-label="Edit"><Pencil size={15} /></button>
                <button
                  type="button"
                  aria-label="Delete"
                  onClick={() => confirm(`Delete the review by ${r.author}?`) && start(async () => { await deleteReview(r.id); router.refresh(); })}
                  className="grid size-9 place-items-center rounded text-brand-deep hover:bg-mist"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
            <p className="mt-1.5 line-clamp-2 text-[13.5px] text-pewter">{r.body}</p>
          </li>
        ))}
      </ul>
    </Panel>
  );
}

function ReviewForm({ value, onSave, onCancel, pending }: { value: ReviewInput; onSave: (v: ReviewInput) => void; onCancel: () => void; pending: boolean }) {
  const [v, setV] = useState(value);
  return (
    <div className="grid gap-4 rounded-[6px] bg-mist-soft p-4 sm:grid-cols-2 lg:grid-cols-3">
      <Field label="Reviewer name"><input className="field" value={v.author} onChange={(e) => setV({ ...v, author: e.target.value })} /></Field>
      <Field label="Stars">
        <select className="field" value={v.rating} onChange={(e) => setV({ ...v, rating: Number(e.target.value) })}>
          {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </Field>
      <Field label="Year"><input className="field" type="number" value={v.year ?? ""} onChange={(e) => setV({ ...v, year: e.target.value ? Number(e.target.value) : null })} /></Field>
      <Field label="Review text" wide><textarea className="field" rows={4} value={v.body} onChange={(e) => setV({ ...v, body: e.target.value })} /></Field>
      <Field label="Order"><input className="field" type="number" value={v.sort_order ?? 0} onChange={(e) => setV({ ...v, sort_order: Number(e.target.value) })} /></Field>
      <div className="flex items-end justify-end gap-2 sm:col-span-2 lg:col-span-2">
        <button type="button" onClick={onCancel} className="btn btn-outline">Cancel</button>
        <button type="button" disabled={pending} onClick={() => onSave(v)} className="btn btn-dark">Save review</button>
      </div>
    </div>
  );
}

// ── Settings ───────────────────────────────────────────────────────────────
export function SettingsPanel({ settings }: { settings: Record<string, string> }) {
  const router = useRouter();
  const [v, setV] = useState(settings);
  const [msg, setMsg] = useState<Msg>(null);
  const [pending, start] = useTransition();
  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) => setV({ ...v, [k]: e.target.value });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        start(async () => {
          const r = await saveSettings(v);
          setMsg(r.ok ? { kind: "ok", text: "Settings saved — the site updates within a few seconds." } : { kind: "error", text: r.error });
          router.refresh();
        });
      }}
    >
      <Panel title="Site settings" actions={<button type="submit" disabled={pending} className="btn btn-dark">{pending ? "Saving…" : "Save settings"}</button>}>
        {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="RERA registration number" hint="Shown in the footer and About page once filled"><input className="field" value={v.rera_number ?? ""} onChange={set("rera_number")} /></Field>
          <Field label="Public email" hint="Leave empty until the inbox is set up"><input className="field" type="email" value={v.public_email ?? ""} onChange={set("public_email")} /></Field>
          <div />
          <Field label="Google rating"><input className="field" value={v.google_rating ?? ""} onChange={set("google_rating")} /></Field>
          <Field label="Google review count"><input className="field" inputMode="numeric" value={v.google_review_count ?? ""} onChange={set("google_review_count")} /></Field>
          <div />
          <Field label="Founder photo" wide>
            <ImageManager images={v.founder_photo ? [v.founder_photo] : []} onChange={(imgs) => setV({ ...v, founder_photo: imgs[imgs.length - 1] ?? "" })} folder="site" />
          </Field>
        </div>
      </Panel>
    </form>
  );
}
