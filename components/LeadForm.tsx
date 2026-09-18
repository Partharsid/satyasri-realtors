"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, CheckCircle, AlertCircle } from "lucide-react";
import { BUSINESS } from "@/data/business";

const schema = z.object({
  name: z.string().min(2, "Please enter your full name").max(100),
  phone: z
    .string()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit Indian mobile number"),
  email: z.string().email("Enter a valid email address").optional().or(z.literal('')),
  budget: z.string().min(1, "Please enter your budget").max(100),
  location: z.string().min(2, "Please enter preferred location").max(100),
  requirement: z.string().min(5, "Please describe your requirement").max(1000),
  // Honeypot — must remain empty; bots fill it, humans don't
  _hp: z.string().max(0, ""),
});

type FormData = z.infer<typeof schema>;

interface LeadFormProps {
  prefilledProperty?: string;
  sourcePage?: string;
}

export default function LeadForm({ prefilledProperty, sourcePage }: LeadFormProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { requirement: prefilledProperty ?? "" },
  });

  const onSubmit = async (data: FormData) => {
    setStatus("loading");
    try {
      // Map new fields to the existing format expected by the API
      // Since API might expect "message" and "property", we combine the new fields into message
      const apiPayload = {
        name: data.name,
        phone: data.phone,
        email: data.email || "not-provided@example.com",
        property: data.location,
        message: `Requirement: ${data.requirement}\nBudget: ${data.budget}\nLocation: ${data.location}`,
        _hp: data._hp,
        sourcePage
      };

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(apiPayload),
      });
      const json = await res.json();
      if (res.ok && json.ok) {
        setStatus("success");
        reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="card p-8 text-center bg-white shadow-lg">
        <CheckCircle size={52} className="mx-auto mb-4 text-[#2d9e6b]" />
        <h3 className="text-xl font-bold font-[var(--font-poppins)] mb-2 text-[#0f2d5c]">Thank you!</h3>
        <p className="text-[#64748b] mb-6">
          We&apos;ve received your enquiry. {BUSINESS.contact.consultant} will get back to you shortly.
        </p>
        <button onClick={() => setStatus("idle")} className="btn-secondary">
          Submit Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {/* Honeypot — visually hidden, never filled by real users */}
      <input
        type="text"
        tabIndex={-1}
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
        {...register("_hp")}
      />

      {status === "error" && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Submission failed.</p>
            <p>
              Please try calling us at{" "}
              <a href={`tel:${BUSINESS.contact.phone}`} className="font-semibold underline">
                {BUSINESS.contact.phoneDisplay}
              </a>{" "}
              or message us on{" "}
              <a href={BUSINESS.contact.whatsapp} className="font-semibold underline text-[#2d9e6b]">
                WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#0f2d5c]" htmlFor="name">
            Full Name <span className="text-[#C9A227]">*</span>
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Ramesh Kumar"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white focus:border-[#C9A227] ${
              errors.name ? "border-red-400" : "border-[#e5e0d8]"
            }`}
            {...register("name")}
          />
          {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#0f2d5c]" htmlFor="phone">
            Mobile Number <span className="text-[#C9A227]">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            autoComplete="tel"
            placeholder="9876543210"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white focus:border-[#C9A227] ${
              errors.phone ? "border-red-400" : "border-[#e5e0d8]"
            }`}
            {...register("phone")}
          />
          {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#0f2d5c]" htmlFor="budget">
            Budget <span className="text-[#C9A227]">*</span>
          </label>
          <input
            id="budget"
            type="text"
            placeholder="e.g., ₹2-3 Cr"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white focus:border-[#C9A227] ${
              errors.budget ? "border-red-400" : "border-[#e5e0d8]"
            }`}
            {...register("budget")}
          />
          {errors.budget && <p className="text-xs text-red-500 mt-1">{errors.budget.message}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5 text-[#0f2d5c]" htmlFor="location">
            Preferred Location <span className="text-[#C9A227]">*</span>
          </label>
          <input
            id="location"
            type="text"
            placeholder="e.g., Kondapur, Gachibowli"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white focus:border-[#C9A227] ${
              errors.location ? "border-red-400" : "border-[#e5e0d8]"
            }`}
            {...register("location")}
          />
          {errors.location && <p className="text-xs text-red-500 mt-1">{errors.location.message}</p>}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#0f2d5c]" htmlFor="email">
          Email <span className="text-[#64748b] font-normal">(Optional)</span>
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white focus:border-[#C9A227] ${
            errors.email ? "border-red-400" : "border-[#e5e0d8]"
          }`}
          {...register("email")}
        />
        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1.5 text-[#0f2d5c]" htmlFor="requirement">
          Detailed Requirement <span className="text-[#C9A227]">*</span>
        </label>
        <textarea
          id="requirement"
          rows={3}
          placeholder="Tell us what you're looking for (e.g. 3BHK, East facing, possession by 2026)..."
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white focus:border-[#C9A227] resize-none ${
            errors.requirement ? "border-red-400" : "border-[#e5e0d8]"
          }`}
          {...register("requirement")}
        />
        {errors.requirement && <p className="text-xs text-red-500 mt-1">{errors.requirement.message}</p>}
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="btn-primary w-full justify-center disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Sending…
          </>
        ) : (
          <>
            <Send size={16} /> Send Enquiry
          </>
        )}
      </button>

      <p className="text-xs text-[#64748b] text-center">
        Or reach us instantly on{" "}
        <a href={BUSINESS.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-[#2d9e6b] font-semibold hover:underline">
          WhatsApp
        </a>
      </p>
    </form>
  );
}