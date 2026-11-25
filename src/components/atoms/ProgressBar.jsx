/**
 * Barra de progreso. El relleno escala en X (no anima width).
 * steps: posiciones opcionales (en unidades de `max`) donde dibujar marcas de sección.
 */
export function ProgressBar({ value, max, label, steps = [], onBrand }) {
  const ratio = Math.min(1, Math.max(0, value / max));
  return (
    <div className={`progress ${onBrand ? "progress--on-brand" : ""}`} role="progressbar"
      aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      <div className="progress__fill" style={{ transform: `scaleX(${ratio})` }} />
      {steps.map((s) => <span key={s} className="progress__tick" style={{ left: `${(s / max) * 100}%` }} />)}
    </div>
  );
}
