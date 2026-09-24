"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ExternalLink, Pencil, Plus, Trash2 } from "lucide-react";
import type { ListingRow } from "@/lib/data";
import { AREAS, AREA_KEYS } from "@/lib/site";
import { formatPrice } from "@/lib/format";
import { slugify } from "@/lib/slug";
import { deleteListing, saveListing, setListingStatus, type ListingInput } from "../actions";
import { Field, ImageManager, LinesField, Notice, Panel, Toggle } from "./fields";

const PRICE_LABELS = { perMonth: "/month", perAcre: "/acre" };

const EMPTY: ListingInput = {
  title: "",
  slug: "",
  summary: "",
  description: "",
  type: "Apartment",
  transaction: "Rent",
  status: "available",
  price: "",
  price_value: null,
  price_unit: "month",
  isFeatured: true,
  sort_order: 0,
  area_key: null,
  location_area: "",
  location_city: "Hyderabad",
  location_state: "Telangana",
  location_full_address: "",
  specs_area: "",
  specs_bedrooms: null,
  specs_bathrooms: null,
  specs_facing: "",
  specs_floor: "",
  specs_furnishing: "",
  specs_parking: "",
  specs_availability: "",
  specs_tenant_restriction: "",
  features: [],
  amenities: [],
  images: [],
};

function toInput(l: ListingRow): ListingInput {
  const pick = (v: string | null) => v ?? "";
  return {
    id: l.id,
    title: l.title,
    slug: l.slug,
    summary: pick(l.summary),
    description: pick(l.description),
    type: l.type,
    transaction: l.transaction,
    status: l.status,
    price: pick(l.price),
    price_value: l.price_value,
    price_unit: l.price_unit,
    isFeatured: l.isFeatured,
    sort_order: l.sort_order,
    area_key: (l.area_key as ListingInput["area_key"]) ?? null,
    location_area: pick(l.location_area),
    location_city: pick(l.location_city),
    location_state: pick(l.location_state),
    location_full_address: pick(l.location_full_address),
    specs_area: pick(l.specs_area),
    specs_bedrooms: l.specs_bedrooms,
    specs_bathrooms: l.specs_bathrooms,
    specs_facing: pick(l.specs_facing),
    specs_floor: pick(l.specs_floor),
    specs_furnishing: pick(l.specs_furnishing),
    specs_parking: pick(l.specs_parking),
    specs_availability: pick(l.specs_availability),
    specs_tenant_restriction: pick(l.specs_tenant_restriction),
    features: l.features ?? [],
    amenities: l.amenities ?? [],
    images: l.images?.length ? l.images : l.thumbnail ? [l.thumbnail] : [],
  };
}

export default function ListingsPanel({ listings }: { listings: ListingRow[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<ListingInput | null>(null);
  const [pending, start] = useTransition();
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);

  if (editing) {
    return (
      <ListingEditor
        initial={editing}
        onDone={(text) => {
          setEditing(null);
          if (text) setMsg({ kind: "ok", text });
          router.refresh();
        }}
      />
    );
  }

  const run = (fn: () => Promise<{ ok: boolean; error?: string }>, ok: string) =>
    start(async () => {
      const r = await fn();
      setMsg(r.ok ? { kind: "ok", text: ok } : { kind: "error", text: r.error ?? "Something went wrong." });
      router.refresh();
    });

  return (
    <Panel
      title={`Properties (${listings.length})`}
      actions={
        <button type="button" onClick={() => setEditing({ ...EMPTY })} className="btn btn-dark">
          <Plus size={16} aria-hidden /> Add property
        </button>
      }
    >
      {msg ? <div className="mb-4"><Notice kind={msg.kind}>{msg.text}</Notice></div> : null}
      {listings.length === 0 ? <p className="text-pewter">No properties yet. Add your first one.</p> : null}
      <ul className={`grid gap-2 ${pending ? "opacity-60" : ""}`}>
        {listings.map((l) => {
          const price = formatPrice(l, PRICE_LABELS);
          return (
            <li key={l.id} className="grid grid-cols-[72px_1fr] gap-3 rounded-[6px] border border-mist p-2 md:grid-cols-[96px_1fr_auto] md:items-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded bg-mist">
                {l.thumbnail ? <Image src={l.thumbnail} alt="" fill sizes="96px" className="object-cover" unoptimized={l.thumbnail.startsWith("http")} /> : null}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[15px]">{l.title}</p>
                <p className="mt-0.5 text-[12.5px] text-pewter">
                  {price.amount}{price.unit} · {l.transaction} · {l.type} · {l.location_area ?? "—"}
                  {l.isFeatured ? " · ★ Featured" : ""}
                </p>
              </div>
              <div className="col-span-2 flex flex-wrap items-center gap-2 md:col-span-1">
                <select
                  aria-label="Status"
                  value={l.status}
                  onChange={(e) => run(() => setListingStatus(l.id, e.target.value as ListingRow["status"]), "Status updated.")}
                  className="field !min-h-9 !w-auto !py-1.5 !text-[13px]"
                >
                  <option value="available">Available</option>
                  <option value="rented">Rented</option>
                  <option value="sold">Sold</option>
                  <option value="hidden">Hidden</option>
                </select>
                <a href={`/en/listings/${l.slug}`} target="_blank" rel="noopener noreferrer" className="grid size-9 place-items-center rounded hover:bg-mist" aria-label="View on site">
                  <ExternalLink size={15} />
                </a>
                <button type="button" onClick={() => setEditing(toInput(l))} className="grid size-9 place-items-center rounded hover:bg-mist" aria-label="Edit">
                  <Pencil size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => confirm(`Delete “${l.title}”? This cannot be undone.`) && run(() => deleteListing(l.id), "Property deleted.")}
                  className="grid size-9 place-items-center rounded text-brand-deep hover:bg-mist"
                  aria-label="Delete"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </Panel>
  );
}

function ListingEditor({ initial, onDone }: { initial: ListingInput; onDone: (msg?: string) => void }) {
  const [v, setV] = useState<ListingInput>(initial);
  const [error, setError] = useState("");
  const [pending, start] = useTransition();
  const set = <K extends keyof ListingInput>(k: K, val: ListingInput[K]) => setV((p) => ({ ...p, [k]: val }));
  const text = (k: keyof ListingInput) => ({
    value: (v[k] as string | null | undefined) ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => set(k, e.target.value as never),
    className: "field",
  });
  const num = (k: "specs_bedrooms" | "specs_bathrooms" | "price_value" | "sort_order") => ({
    type: "number",
    inputMode: "numeric" as const,
    value: v[k] ?? "",
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => set(k, e.target.value === "" ? null : (Number(e.target.value) as never)),
    className: "field",
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    start(async () => {
      const r = await saveListing({ ...v, features: v.features?.filter(Boolean), amenities: v.amenities?.filter(Boolean) });
      if (r.ok) onDone(initial.id ? "Property saved." : "Property added.");
      else setError(r.error);
    });
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <Panel
        title={initial.id ? "Edit property" : "New property"}
        actions={
          <div className="flex gap-2">
            <button type="button" onClick={() => onDone()} className="btn btn-outline">Cancel</button>
            <button type="submit" disabled={pending} className="btn btn-dark">{pending ? "Saving…" : "Save property"}</button>
          </div>
        }
      >
        {error ? <div className="mb-4"><Notice kind="error">{error}</Notice></div> : null}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Title" wide><input {...text("title")} required /></Field>
          <Field label="URL slug" hint={`satyasri.com/en/listings/${slugify(v.slug || v.title) || "…"}`}><input {...text("slug")} placeholder="auto from title" /></Field>
          <Field label="Transaction">
            <select className="field" value={v.transaction} onChange={(e) => set("transaction", e.target.value as ListingInput["transaction"])}>
              <option value="Rent">Rent</option><option value="Sale">Sale</option><option value="Lease">Lease</option>
            </select>
          </Field>
          <Field label="Property type">
            <select className="field" value={v.type} onChange={(e) => set("type", e.target.value as ListingInput["type"])}>
              <option>Apartment</option><option>Villa</option><option>Land</option><option>Commercial</option>
            </select>
          </Field>
          <Field label="Price (₹, number only)" hint="e.g. 52000 or 12500000 — used for filters and display">
            <input {...num("price_value")} min={0} />
          </Field>
          <Field label="Price is per">
            <select className="field" value={v.price_unit} onChange={(e) => set("price_unit", e.target.value as ListingInput["price_unit"])}>
              <option value="month">Month (rent)</option><option value="total">Total price</option><option value="acre">Acre</option><option value="sqyd">Sq. yard</option><option value="sqft">Sq. ft</option>
            </select>
          </Field>
          <Field label="Price text (optional)" hint="Shown only when the number is empty, e.g. “Price on request”"><input {...text("price")} /></Field>
          <Field label="Summary (card text)" wide><textarea {...text("summary")} rows={2} /></Field>
          <Field label="Description" wide><textarea {...text("description")} rows={5} /></Field>
        </div>
      </Panel>

      <Panel title="Photos">
        <ImageManager images={v.images ?? []} onChange={(imgs) => set("images", imgs)} folder="listings" />
      </Panel>

      <Panel title="Location">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Neighbourhood page" hint="Shows this property on that area's page">
            <select className="field" value={v.area_key ?? ""} onChange={(e) => set("area_key", (e.target.value || null) as ListingInput["area_key"])}>
              <option value="">— None / outside Hyderabad —</option>
              {AREA_KEYS.map((k) => <option key={k} value={k}>{AREAS[k].name}</option>)}
            </select>
          </Field>
          <Field label="Area / locality"><input {...text("location_area")} /></Field>
          <Field label="City"><input {...text("location_city")} /></Field>
          <Field label="State"><input {...text("location_state")} /></Field>
          <Field label="Full address (optional)" wide><input {...text("location_full_address")} /></Field>
        </div>
      </Panel>

      <Panel title="Details">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Field label="Area" hint="e.g. 1,844 Sq. Ft. or 105 Acres"><input {...text("specs_area")} /></Field>
          <Field label="Bedrooms"><input {...num("specs_bedrooms")} min={0} /></Field>
          <Field label="Bathrooms"><input {...num("specs_bathrooms")} min={0} /></Field>
          <Field label="Facing"><input {...text("specs_facing")} placeholder="West" /></Field>
          <Field label="Floor"><input {...text("specs_floor")} /></Field>
          <Field label="Furnishing"><input {...text("specs_furnishing")} placeholder="Semi-furnished" /></Field>
          <Field label="Parking"><input {...text("specs_parking")} /></Field>
          <Field label="Availability"><input {...text("specs_availability")} placeholder="Ready to move" /></Field>
          <Field label="Preferred tenants"><input {...text("specs_tenant_restriction")} placeholder="Family only" /></Field>
          <Field label="Highlights (one per line)" wide><LinesField value={v.features ?? []} onChange={(x) => set("features", x)} /></Field>
          <Field label="Amenities (one per line)" wide><LinesField value={v.amenities ?? []} onChange={(x) => set("amenities", x)} /></Field>
        </div>
      </Panel>

      <Panel title="Visibility">
        <div className="grid gap-4 sm:grid-cols-3 sm:items-end">
          <Field label="Status">
            <select className="field" value={v.status} onChange={(e) => set("status", e.target.value as ListingInput["status"])}>
              <option value="available">Available</option><option value="rented">Rented</option><option value="sold">Sold</option><option value="hidden">Hidden (not on site)</option>
            </select>
          </Field>
          <Field label="Sort order" hint="Lower numbers show first"><input {...num("sort_order")} /></Field>
          <div className="pb-3"><Toggle checked={!!v.isFeatured} onChange={(x) => set("isFeatured", x)} label="Feature on home page" /></div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={() => onDone()} className="btn btn-outline">Cancel</button>
          <button type="submit" disabled={pending} className="btn btn-dark">{pending ? "Saving…" : "Save property"}</button>
        </div>
      </Panel>
    </form>
  );
}
