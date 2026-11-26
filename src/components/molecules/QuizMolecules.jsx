import { Icon } from "../atoms";

const LETRAS = "ABCDEFGH";

/** Opción de respuesta tipo tarjeta, con letra y palomita al elegir. */
export function OptionButton({ index, label, active, onClick }) {
  return (
    <button className={`opt ${active ? "opt--on" : ""}`} onClick={onClick} aria-pressed={active}>
      <span className="opt__key">{LETRAS[index]}</span>
      <span className="opt__label">{label}</span>
      <span className="opt__tick">{active && <Icon name="check" size={18} />}</span>
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
          <li key={s.nombre} className={`stepper__item stepper__item--${estado}`}>
            <span className="stepper__dot">{estado === "done" ? <Icon name="check" size={14} /> : n + 1}</span>
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
