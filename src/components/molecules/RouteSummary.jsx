import { Badge } from "../atoms";
import { NOMBRE_RUTA } from "../../services/motorRuta";

export function RouteSummary({ ruta, explicacion }) {
  return (
    <section className="route">
      <p className="route__eyebrow">Tu ruta principal</p>
      <h1>{NOMBRE_RUTA[ruta.principal]}</h1>
      <p>{explicacion}</p>
      {ruta.puente && (
        <p className="route__puente">
          Te sugerimos un puente de <Badge tone={ruta.puente}>{NOMBRE_RUTA[ruta.puente]}</Badge>
        </p>
      )}
    </section>
  );
}
