import { Icon } from "../../components/atoms";

/** Cómo contactar a la usuaria: correo, teléfono y la forma segura que ella eligió. */
export function Contacto({ c, compacto }) {
  if (!c) return null;
  const filas = [
    c.telefono && ["telefono", <a key="t" href={`tel:${c.telefono.replace(/\s/g, "")}`}>{c.telefono}</a>],
    c.correo && ["correo", <a key="c" href={`mailto:${c.correo}`}>{c.correo}</a>],
    c.medio && ["chat", <span key="m">Prefiere: {c.medio}{c.horario ? ` · ${c.horario}` : ""}{c.dejar_mensaje ? " · se puede dejar mensaje" : ""}</span>],
  ].filter(Boolean);
  if (!filas.length) return <p className="muted small">Sin datos de contacto. Pídeselos en su próxima visita.</p>;
  return (
    <ul className={`m4-contacto ${compacto ? "m4-contacto--compacto" : ""}`}>
      {filas.map(([ic, el]) => <li key={ic}><Icon name={ic} size={compacto ? 14 : 16} /> {el}</li>)}
    </ul>
  );
}
