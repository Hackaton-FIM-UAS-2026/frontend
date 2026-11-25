import { Badge, Icon } from "../atoms";
import { NOMBRE_RUTA } from "../../services/motorRuta";

/** Recurso como tarjeta: toda la superficie abre el detalle (botón estirado en el título). */
export function ResourceCard({ recurso, onOpen }) {
  return (
    <article className="card card--link rcard">
      <div className="rcard__rutas">
        {recurso.rutas.map((r) => <Badge key={r} tone={r} dot>{NOMBRE_RUTA[r]}</Badge>)}
      </div>
      <h3 className="card__title">
        <button type="button" className="rcard__open" onClick={() => onOpen(recurso.id)}>{recurso.titulo}</button>
      </h3>
      <p className="rcard__prov">{recurso.proveedor}</p>
      <p className="rcard__meta">
        <span><Icon name="ubicacion" size={16} /> {recurso.modalidad}</span>
        <span><Icon name="reloj" size={16} /> {recurso.horario}</span>
      </p>
      <span className="card__more" aria-hidden="true">Ver detalle <Icon name="flecha" size={16} /></span>
    </article>
  );
}
