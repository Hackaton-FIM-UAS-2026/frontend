import { useNavigate } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Button } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { solicitudes } from "./servicio.js";
import { ORIGEN, Urgencia, Vacio } from "./comun.jsx";
import "./estilos.css";

/** Trabajo Social: solicitudes nuevas (llegan del asistente), por urgencia. */
export default function Solicitudes() {
  const nav = useNavigate();
  const { datos, cargando, error, recargar } = useApi(solicitudes);
  if (!datos) return <ApiEstado cargando={cargando} error={error} reintentar={recargar} />;
  if (!datos.length) return <Vacio>No hay solicitudes nuevas. Cuando una mujer pida apoyo desde el asistente, aparecerá aquí.</Vacio>;
  return (
    <Panel>
      <div className="tablewrap">
        <table className="dt dt--stack">
          <thead><tr><th>Folio</th><th>Mujer</th><th>Llegó por</th><th>Urgencia</th><th>Hace</th><th /></tr></thead>
          <tbody>
            {datos.map((s) => (
              <tr key={s.folio}>
                <td className="dt__main"><strong>{s.folio}</strong></td>
                <td data-label="Mujer">{s.nombre}</td>
                <td data-label="Llegó por">{ORIGEN[s.origen] || s.origen}</td>
                <td data-label="Urgencia"><Urgencia valor={s.urgencia} /></td>
                <td data-label="Hace">{s.hace}</td>
                <td className="dt__end"><Button size="sm" onClick={() => nav(`/admin/expedientes/${s.usuaria_id}`)}>Abrir</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
