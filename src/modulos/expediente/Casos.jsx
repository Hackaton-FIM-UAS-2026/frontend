import { useNavigate } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Badge, Button } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { casos } from "./servicio.js";
import { Urgencia, Vacio } from "./comun.jsx";
import "./estilos.css";

/** Casos asignados (Trabajo Social ve todos; cada especialista, solo los de su área). */
export default function Casos() {
  const nav = useNavigate();
  const { datos, cargando, error, recargar } = useApi(casos);
  if (!datos) return <ApiEstado cargando={cargando} error={error} reintentar={recargar} />;
  if (!datos.length) return <Vacio>No tienes casos abiertos.</Vacio>;
  return (
    <Panel>
      <div className="tablewrap">
        <table className="dt dt--stack">
          <thead><tr><th>Folio</th><th>Mujer</th><th>Atención</th><th>Estado</th><th>Urgencia</th><th /></tr></thead>
          <tbody>
            {datos.map((c) => (
              <tr key={c.folio}>
                <td className="dt__main"><strong>{c.folio}</strong></td>
                <td data-label="Mujer">{c.nombre}</td>
                <td data-label="Atención">{c.area}</td>
                <td data-label="Estado"><Badge tone="primary">{c.estado}</Badge></td>
                <td data-label="Urgencia"><Urgencia valor={c.urgencia} /></td>
                <td className="dt__end"><Button size="sm" variant="quiet" onClick={() => nav(`/admin/expedientes/${c.usuaria_id}`)}>Ver expediente</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
