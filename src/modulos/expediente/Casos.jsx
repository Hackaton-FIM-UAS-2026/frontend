import { useNavigate } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Badge, Button } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { casos } from "./servicio.js";
import { Urgencia, Vacio } from "./comun.jsx";
import { Contacto } from "./Contacto.jsx";
import { fechaCita, MODALIDAD } from "../../services/fechas";
import "./estilos.css";
import { cap } from "../../services/texto";

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
          <thead><tr><th>Folio</th><th>Mujer y contacto</th><th>Cita</th><th>Estado</th><th>Urgencia</th><th /></tr></thead>
          <tbody>
            {datos.map((c) => (
              <tr key={c.folio}>
                <td className="dt__main"><strong>{c.folio}</strong></td>
                <td data-label="Mujer"><strong>{c.nombre}</strong><small className="m4-area">Atención {c.area}</small><Contacto c={c} compacto /></td>
                <td data-label="Cita">{c.cita ? <span className="m4-cita-celda"><b>{fechaCita(c.cita.fecha)}</b><small>{MODALIDAD[c.cita.modalidad]}</small></span>
                  : <span className="muted small">Sin cita</span>}</td>
                <td data-label="Estado"><Badge tone="primary">{cap(c.estado)}</Badge></td>
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
