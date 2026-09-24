import Image from "next/image";

/** Building mark + wordmark. `tone` flips the wordmark colour for dark backgrounds. */
export function Logo({ tone = "dark", compact = false }: { tone?: "dark" | "light"; compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <Image src="/brand/icon.svg" alt="" width={40} height={29} priority className="h-[26px] w-auto md:h-[29px]" />
      <span className={`flex flex-col leading-none ${tone === "light" ? "text-paper" : "text-charcoal"}`}>
        <span className="text-[17px] font-semibold tracking-[0.02em] md:text-[19px]">SATYASRI</span>
        {!compact && (
          <span className="mt-[3px] text-[8.5px] font-medium tracking-[0.42em] md:text-[9.5px]">REALTORS</span>
        )}
      </span>
    </span>
  );
}
