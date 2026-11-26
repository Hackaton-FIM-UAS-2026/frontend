import { Panel } from "../../components/organisms";
import { Estado } from "./comun.jsx";

export default function MiEmpresa({ empresa: e }) {
  const filas = [["RFC", e.rfc], ["Giro", e.giro], ["Contacto", e.contacto_nombre], ["Teléfono", e.telefono]];
  return (
    <Panel titulo="Mi empresa">
      <div className="m6-pila">
        <Estado valor={e.estado} empresa />
        {e.motivo && <p className="m6-muted">Motivo: {e.motivo}</p>}
        {e.logo_url && <img src={e.logo_url} alt={`Logo de ${e.nombre}`} className="m6-logo" />}
        <dl className="m6-datos">{filas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v || "—"}</dd></div>)}</dl>
      </div>
    </Panel>
  );
}
