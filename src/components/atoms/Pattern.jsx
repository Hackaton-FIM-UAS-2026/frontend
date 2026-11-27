import { useId } from "react";

/** Textura de hojas (guiño a los carteles). Decorativa; ningún template la usa por defecto. */
export function Pattern({ color = "var(--morado-300)", opacity = 0.18 }) {
  const id = useId();
  return (
    <svg className="pattern" aria-hidden="true" width="100%" height="100%">
      <defs>
        <pattern id={id} width="90" height="90" patternUnits="userSpaceOnUse">
          <g fill={color} opacity={opacity}>
            <path d="M10 50C10 28 24 14 46 14c0 22-14 36-36 36z" />
            <path d="M52 86c0-18 11-30 29-30 0 18-11 30-29 30z" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * Ilustración del camino: colinas en capas moradas y un sendero crema que sube
 * hacia el horizonte. Monocroma, sin arcoíris.
 */
export function CaminoIlustracion({ className = "" }) {
  return (
    <svg className={`camino-ilus ${className}`} viewBox="0 0 400 320" role="img"
      aria-label="Un sendero que sube entre colinas hacia el horizonte">
      <rect width="400" height="320" rx="24" fill="var(--morado-50)" />
      <circle className="camino-ilus__sol" cx="292" cy="96" r="44" fill="var(--guinda-100)" />
      <path d="M0 176c56-30 112-40 176-26s132 10 224-20v190H0z" fill="var(--morado-100)" />
      <path d="M0 214c70-26 150-34 230-14s120 8 170-8v128H0z" fill="var(--morado-200)" />
      <path d="M0 256c90-22 170-22 250-6s110 6 150-2v72H0z" fill="var(--morado-300)" />
      {/* sendero */}
      <path d="M150 320c10-40 70-52 92-78s-18-44 6-66 40-24 46-30"
        fill="none" stroke="var(--crema-50)" strokeWidth="26" strokeLinecap="round" />
      <path d="M150 320c10-40 70-52 92-78s-18-44 6-66 40-24 46-30"
        className="camino-ilus__pasos" fill="none" stroke="var(--morado-500)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="2 12" />
      {/* hojas */}
      <g className="camino-ilus__hoja">
        <path d="M62 236c0-20 13-34 34-34 0 20-13 34-34 34z" fill="var(--morado-700)" />
        <path d="M62 236L90 208" stroke="var(--morado-200)" strokeWidth="2" strokeLinecap="round" />
      </g>
      <path className="camino-ilus__hoja camino-ilus__hoja--2" d="M332 262c0-14 9-24 24-24 0 14-9 24-24 24z" fill="var(--morado-800)" />
      {/* meta: un pulso suave señala hacia dónde va el camino */}
      <circle className="camino-ilus__pulso" cx="294" cy="146" r="6" fill="none" stroke="var(--guinda-700)" strokeWidth="2" />
      <circle cx="294" cy="146" r="6" fill="var(--guinda-700)" />
    </svg>
  );
}

/** Alias por compatibilidad con el nombre anterior. */
export const ArcosIlustracion = CaminoIlustracion;
