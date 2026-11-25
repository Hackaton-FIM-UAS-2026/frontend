import { Icon } from "../atoms";

const LETRAS = "ABCDEFGH";

/** Opción de respuesta: letra, texto y palomita al elegir. Se usa en test, apoyo y detalle. */
export function OptionButton({ index, label, active, onClick, compact, role = "button" }) {
  const aria = role === "radio" ? { role: "radio", "aria-checked": active } : { "aria-pressed": active };
  return (
    <button type="button" className={`opt ${active ? "opt--on" : ""} ${compact ? "opt--compact" : ""}`} onClick={onClick} {...aria}>
      {index !== undefined && <span className="opt__key" aria-hidden="true">{LETRAS[index]}</span>}
      <span className="opt__label">{label}</span>
      <span className="opt__tick" aria-hidden="true"><Icon name="check" size={14} strokeWidth="3" /></span>
    </button>
  );
}

/** Lista vertical de secciones del test con su estado (hecha / actual / pendiente). */
export function SectionStepper({ secciones, actual }) {
  return (
    <ol className="stepper">
      {secciones.map((s, n) => {
        const estado = n < actual ? "done" : n === actual ? "now" : "todo";
        return (
          <li key={s.nombre} className={`stepper__item stepper__item--${estado}`} aria-current={estado === "now" ? "step" : undefined}>
            <span className="stepper__dot">{estado === "done" ? <Icon name="check" size={14} strokeWidth="3" /> : n + 1}</span>
            <span>
              <strong>{s.nombre}</strong>
              <small>{s.detalle}</small>
            </span>
          </li>
        );
      })}
    </ol>
  );
}
