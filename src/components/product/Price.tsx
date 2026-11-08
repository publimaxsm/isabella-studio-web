import { formatBs, formatUSD } from "@/lib/currency";

/** Precio en USD (principal) + equivalente en Bs a la tasa del día */
export function Price({
  amount,
  compareAt,
  size = "md",
  showBs = true,
}: {
  amount: number;
  compareAt?: number;
  size?: "sm" | "md" | "lg";
  showBs?: boolean;
}) {
  const main = { sm: "text-[15px]", md: "text-base", lg: "text-2xl" }[size];
  return (
    <div className="flex flex-col">
      <div className="flex items-baseline gap-2">
        <span className={`${main} font-normal text-accent-ink`}>{formatUSD(amount)}</span>
        {compareAt && compareAt > amount && (
          <span className="text-[13px] text-muted line-through">{formatUSD(compareAt)}</span>
        )}
      </div>
      {showBs && <span className="text-[12px] text-muted">{formatBs(amount)}</span>}
    </div>
  );
}
