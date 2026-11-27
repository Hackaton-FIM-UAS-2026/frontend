import { Link } from "react-router-dom";
import { horarioDe } from "../../services/texto";

const TIPO = { vacante: ["Vacante", "vacante"], curso: ["Curso", "curso"], beca: ["Beca", "apoyo"], apoyo: ["Apoyo", "apoyo"], financiamiento: ["Apoyo", "apoyo"] };

/** Tarjeta de una opción. `extra` = línea adicional (p. ej. «Cumples 3 de 4»). */
export function Tarjeta({ r, etiqueta, children }) {
  const [txt, tono] = TIPO[r.tipo] || ["Opción", "apoyo"];
  const detalle = [horarioDe(r), r.modalidad === "En línea" ? "En línea" : r.ubicacion, r.sueldo || (r.costo === "Gratis" && r.tipo !== "vacante" ? "Gratis" : null)]
    .filter(Boolean).join(" · ");
  return (
    <Link to={`/recurso/${r.id}`} className="card card--link m3-tarjeta">
      <span className={`m3-tipo m3-tipo--${tono}`}>{etiqueta || txt}</span>
      <span className="m3-tarjeta__titulo">{r.titulo}{r.proveedor && r.tipo === "vacante" ? ` · ${r.proveedor}` : ""}</span>
      {detalle && <span className="m3-tarjeta__det">{detalle}</span>}
      {children}
    </Link>
  );
}

export function Avance({ cumplidos, total }) {
  const todo = total === 0 || cumplidos === total;
  return (
    <span className="m3-avance">
      {todo ? "Cumples todo" : `Cumples ${cumplidos} de ${total}`}
      <span className="m3-barra" aria-hidden="true"><i style={{ width: `${total ? (cumplidos / total) * 100 : 100}%` }} /></span>
    </span>
  );
}
