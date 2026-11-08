import type { VisualKind } from "@/types";

/**
 * Ilustración provisional del producto (SVG) mientras llegan las fotos reales.
 * Se dibuja siempre sobre fondo crema (--media), también en modo oscuro.
 * Cuando el producto tenga `images`, ProductMedia muestra la foto en su lugar.
 */

const INK = "#2B2320";
const GOLD = "#C9A45C";
const GLASS = "#FBF8F3";
const EDGE = "rgba(54,44,39,0.16)";

function Shadow({ w = 70 }: { w?: number }) {
  return <ellipse cx="100" cy="214" rx={w} ry="7" fill="rgba(54,44,39,0.10)" />;
}

export function ProductVisual({ kind, tone = "#C88A75", className = "" }: { kind: VisualKind; tone?: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 240" className={className} role="img" aria-hidden>
      {render(kind, tone)}
    </svg>
  );
}

function render(kind: VisualKind, tone: string) {
  switch (kind) {
    case "lipstick":
      return (
        <g>
          <Shadow w={34} />
          <rect x="78" y="128" width="44" height="84" rx="4" fill={INK} />
          <rect x="78" y="128" width="44" height="10" fill={GOLD} />
          <rect x="83" y="96" width="34" height="34" rx="2" fill={GOLD} />
          <path d="M86 98 V60 Q86 44 108 34 L114 32 V98 Z" fill={tone} />
          <path d="M100 96 V52" stroke="rgba(255,255,255,0.35)" strokeWidth="3" strokeLinecap="round" />
        </g>
      );
    case "foundation":
      return (
        <g>
          <Shadow w={44} />
          <rect x="62" y="96" width="76" height="116" rx="14" fill={GLASS} stroke={EDGE} />
          <rect x="68" y="120" width="64" height="86" rx="10" fill={tone} />
          <rect x="84" y="62" width="32" height="34" rx="3" fill={INK} />
          <rect x="84" y="88" width="32" height="8" fill={GOLD} />
          <text x="100" y="166" textAnchor="middle" fontFamily="Georgia" fontSize="9" letterSpacing="2" fill="rgba(255,255,255,0.85)">SKIN SILK</text>
        </g>
      );
    case "dropper":
      return (
        <g>
          <Shadow w={38} />
          <rect x="68" y="104" width="64" height="108" rx="10" fill={GLASS} stroke={EDGE} />
          <rect x="73" y="140" width="54" height="66" rx="7" fill={tone} opacity="0.85" />
          <rect x="84" y="80" width="32" height="26" rx="3" fill={GOLD} />
          <path d="M90 80 V56 Q90 40 100 40 Q110 40 110 56 V80 Z" fill={INK} />
          <rect x="80" y="118" width="40" height="14" rx="2" fill="rgba(255,255,255,0.7)" />
        </g>
      );
    case "tube":
      return (
        <g>
          <Shadow w={30} />
          <path d="M74 36 H126 L120 176 H80 Z" fill={GLASS} stroke={EDGE} />
          <path d="M76 36 H124 L122 70 H78 Z" fill={tone} opacity="0.55" />
          <rect x="78" y="176" width="44" height="38" rx="5" fill={INK} />
          <rect x="78" y="176" width="44" height="6" fill={GOLD} />
          <path d="M86 96 H114" stroke={EDGE} strokeWidth="2" />
          <path d="M88 106 H112" stroke={EDGE} strokeWidth="2" />
        </g>
      );
    case "jar":
      return (
        <g>
          <Shadow w={56} />
          <rect x="48" y="132" width="104" height="80" rx="16" fill={GLASS} stroke={EDGE} />
          <rect x="54" y="146" width="92" height="60" rx="11" fill={tone} />
          <rect x="44" y="104" width="112" height="32" rx="8" fill={INK} />
          <rect x="44" y="128" width="112" height="6" fill={GOLD} />
        </g>
      );
    case "palette":
      return (
        <g>
          <Shadow w={66} />
          <rect x="34" y="70" width="132" height="132" rx="10" fill={INK} />
          <rect x="34" y="70" width="132" height="132" rx="10" fill="none" stroke={GOLD} strokeWidth="2" />
          {["#E8C7AE", "#D49A7B", "#B5745A", "#C99A63", "#8E4E3A", "#E2B07A", "#6E3B2E", "#B8876A", "#D5A06C"].map((c, i) => (
            <circle key={i} cx={64 + (i % 3) * 36} cy={102 + Math.floor(i / 3) * 36} r="14" fill={c} />
          ))}
        </g>
      );
    case "compact":
      return (
        <g>
          <Shadow w={56} />
          <circle cx="100" cy="146" r="62" fill={INK} />
          <circle cx="100" cy="146" r="62" fill="none" stroke={GOLD} strokeWidth="3" />
          <circle cx="100" cy="146" r="46" fill={tone} />
          <path d="M72 128 Q90 112 116 118" stroke="rgba(255,255,255,0.35)" strokeWidth="5" fill="none" strokeLinecap="round" />
        </g>
      );
    case "mascara":
      return (
        <g transform="rotate(-18 100 130)">
          <Shadow w={34} />
          <rect x="86" y="96" width="28" height="116" rx="12" fill={INK} />
          <rect x="86" y="96" width="28" height="8" fill={GOLD} />
          <rect x="94" y="40" width="12" height="58" rx="4" fill={GOLD} />
          <rect x="91" y="22" width="18" height="26" rx="8" fill={tone} />
        </g>
      );
    case "perfume":
      return (
        <g>
          <Shadow w={52} />
          <path d="M56 110 L72 92 H128 L144 110 V196 Q144 212 128 212 H72 Q56 212 56 196 Z" fill={GLASS} stroke={EDGE} />
          <path d="M64 118 L76 104 H124 L136 118 V192 Q136 204 124 204 H76 Q64 204 64 192 Z" fill={tone} />
          <rect x="88" y="70" width="24" height="22" fill={GOLD} />
          <rect x="80" y="40" width="40" height="32" rx="4" fill={INK} />
          <circle cx="100" cy="156" r="16" fill="none" stroke={GOLD} strokeWidth="1.5" />
        </g>
      );
    case "mist":
      return (
        <g>
          <Shadow w={34} />
          <rect x="74" y="72" width="52" height="140" rx="12" fill={GLASS} stroke={EDGE} />
          <rect x="78" y="96" width="44" height="110" rx="9" fill={tone} />
          <rect x="84" y="48" width="32" height="26" rx="3" fill={INK} />
          <rect x="84" y="66" width="32" height="6" fill={GOLD} />
          <text x="100" y="156" textAnchor="middle" fontFamily="Georgia" fontSize="8" letterSpacing="1.5" fill={INK} opacity="0.6">BODY MIST</text>
        </g>
      );
    case "brush":
      return (
        <g>
          <Shadow w={56} />
          {[-16, 0, 16].map((r, i) => (
            <g key={i} transform={`rotate(${r} 100 210)`}>
              <rect x="95" y="98" width="10" height="112" rx="4" fill={INK} />
              <rect x="93" y="74" width="14" height="28" rx="2" fill={GOLD} />
              <path d={i === 1 ? "M90 76 Q100 26 110 76 Z" : "M92 76 Q100 40 108 76 Z"} fill={i === 1 ? tone : "#E9D2BF"} />
            </g>
          ))}
        </g>
      );
    case "sponge":
      return (
        <g>
          <Shadow w={42} />
          <path d="M100 52 C130 80 148 120 148 152 A48 48 0 0 1 52 152 C52 120 70 80 100 52 Z" fill={tone} />
          <path d="M84 120 Q92 102 108 96" stroke="rgba(255,255,255,0.4)" strokeWidth="6" fill="none" strokeLinecap="round" />
        </g>
      );
    case "curler":
      return (
        <g>
          <Shadow w={50} />
          <path d="M56 80 Q100 56 144 80" stroke={GOLD} strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M62 92 Q100 74 138 92" stroke={INK} strokeWidth="6" fill="none" strokeLinecap="round" />
          <path d="M80 90 L92 196 M120 90 L108 196" stroke={GOLD} strokeWidth="6" strokeLinecap="round" />
          <circle cx="92" cy="200" r="10" fill="none" stroke={GOLD} strokeWidth="5" />
          <circle cx="108" cy="200" r="10" fill="none" stroke={GOLD} strokeWidth="5" />
        </g>
      );
    case "pump":
      return (
        <g>
          <Shadow w={40} />
          <rect x="66" y="92" width="68" height="120" rx="14" fill={GLASS} stroke={EDGE} />
          <rect x="71" y="116" width="58" height="90" rx="10" fill={tone} />
          <rect x="88" y="70" width="24" height="24" fill={INK} />
          <path d="M92 70 V52 H128 V60 H104 V70" fill={INK} />
          <rect x="88" y="88" width="24" height="5" fill={GOLD} />
        </g>
      );
    case "kit":
      return (
        <g>
          <ellipse cx="100" cy="214" rx="80" ry="7" fill="rgba(54,44,39,0.10)" />
          <g transform="translate(-46 18) scale(0.82)">{render("pump", "#D9E3DD")}</g>
          <g transform="translate(36 0) scale(0.82)">{render("tube", "#F2E6D6")}</g>
          <g transform="translate(-6 30) scale(0.78)">{render("dropper", tone)}</g>
        </g>
      );
  }
}
