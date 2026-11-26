import { useId } from "react";

/** Textura de hojas / remolinos (guiño al fondo crema de los carteles). Decorativa. */
export function Pattern({ color = "var(--morado-300)", opacity = 0.18 }) {
  const id = useId();
  return (
    <svg className="pattern" aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width="90" height="90" patternUnits="userSpaceOnUse">
          <g fill={color} opacity={opacity}>
            <path d="M10 50C10 28 24 14 46 14c0 22-14 36-36 36z" />
            <path d="M52 86c0-18 11-30 29-30 0 18-11 30-29 30z" />
            <circle cx="70" cy="22" r="6" />
            <circle cx="22" cy="74" r="4" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Ilustración original del hero: arcos de colores que "suben" como un camino. */
export function ArcosIlustracion() {
  const arcos = [
    ["var(--turquesa-500)", 150], ["var(--naranja-500)", 126], ["var(--mostaza-500)", 102],
    ["var(--oliva-500)", 78], ["var(--magenta-500)", 54],
  ];
  return (
    <svg className="arcos" viewBox="0 0 400 300" role="img" aria-label="Arcos de colores que forman un camino ascendente">
      {arcos.map(([c, r]) => (
        <path key={r} d={`M${200 - r} 290 A${r} ${r} 0 0 1 ${200 + r} 290`} fill="none" stroke={c} strokeWidth="18" strokeLinecap="round" />
      ))}
      <circle cx="200" cy="290" r="22" fill="var(--coral-500)" />
      <g fill="var(--morado-700)">
        <circle cx="52" cy="238" r="7" /><circle cx="34" cy="196" r="5" /><circle cx="26" cy="160" r="3.5" />
      </g>
      <path d="M338 70c0-22 14-38 38-38 0 22-14 38-38 38z" fill="var(--morado-500)" />
      <path d="M338 70L368 40" stroke="#fff" strokeWidth="2" />
    </svg>
  );
}
