import { Badge, Button } from "../atoms";
import { NOMBRE_RUTA } from "../../services/motorRuta";

export function ResourceCard({ recurso, onOpen }) {
  return (
    <article className="rcard">
      <div className="rcard__top">
        {recurso.rutas.map((r) => <Badge key={r} tone={r}>{NOMBRE_RUTA[r]}</Badge>)}
        <span className="rcard__tipo">{recurso.tipo}</span>
      </div>
      <h3>{recurso.titulo}</h3>
      <p className="rcard__meta">{recurso.proveedor} · {recurso.modalidad} · {recurso.horario}</p>
      <Button variant="ghost" onClick={() => onOpen(recurso.id)}>Ver detalle</Button>
    </article>
  );
}
