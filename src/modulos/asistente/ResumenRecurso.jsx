import { Link } from "react-router-dom";
import { horarioDe } from "../../services/texto";

const TIPO = { vacante: ["Vacante", "vacante"], curso: ["Curso", "curso"], beca: ["Beca", "apoyo"], apoyo: ["Apoyo", "apoyo"], financiamiento: ["Apoyo", "apoyo"] };

/** Tarjeta tocable de un recurso citado por el asistente. */
export function ResumenRecurso({ recurso }) {
  const [etq, tono] = TIPO[recurso.tipo] || ["Opción", "apoyo"];
  return (
    <Link to={`/recurso/${recurso.id}`} className="card card--link m2-recurso">
      <span className={`m2-tipo m2-tipo--${tono}`}>{etq}</span>
      <b>{recurso.titulo}</b>
      <small>{[recurso.proveedor, horarioDe(recurso)].filter(Boolean).join(" · ")}</small>
    </Link>
  );
}
