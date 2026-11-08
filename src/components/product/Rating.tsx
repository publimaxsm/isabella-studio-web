import { StarIcon } from "@/components/ui/Icons";

export function Rating({ value, count, compact = false }: { value: number; count: number; compact?: boolean }) {
  return (
    <div className="flex items-center gap-1.5 text-[12px] text-muted" aria-label={`${value} de 5 estrellas, ${count} reseñas`}>
      <span className="flex text-accent">
        {Array.from({ length: 5 }).map((_, i) => (
          <StarIcon key={i} size={compact ? 11 : 13} filled={i < Math.round(value)} />
        ))}
      </span>
      <span>
        {value.toFixed(1)} {!compact && `· ${count} reseñas`}
        {compact && `(${count})`}
      </span>
    </div>
  );
}
