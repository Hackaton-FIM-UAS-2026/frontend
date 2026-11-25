import { Badge, Icon } from "../atoms";
import { NOMBRE_RUTA } from "../../services/motorRuta";

/** Resultado del test: ruta principal, por qué, y puente sugerido. */
export function RouteSummary({ ruta, explicacion, factores = [] }) {
  return (
    <section className="card card--brand route" aria-labelledby="ruta-titulo">
      <h1 id="ruta-titulo">Tu ruta: {NOMBRE_RUTA[ruta.principal]}</h1>
      <p className="route__lead">{explicacion}</p>
      {factores.length > 1 && (
        <ul className="route__factores">
          {factores.map((f) => <li key={f}><Icon name="check" size={18} /> {f}</li>)}
        </ul>
      )}
      {ruta.puente && (
        <p className="route__puente">
          Te sugerimos un puente de <Badge tone={ruta.puente}>{NOMBRE_RUTA[ruta.puente]}</Badge>
        </p>
      )}
    </section>
  );
}
