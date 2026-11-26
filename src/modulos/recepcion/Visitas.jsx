import { useState } from "react";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Badge, Button } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { marcar, visitas } from "./servicio.js";
import "./estilos.css";

const ESTADO = { por_llegar: ["warning", "Por llegar"], llego: ["success", "Llegó"], no_vino: ["neutral", "No vino"] };
const fecha = (iso) => new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${iso}T12:00:00`));

/** Recepción: quién va a llegar, cuándo y a qué módulo. Nunca el motivo. */
export default function Visitas({ yo }) {
  const [cuando, setCuando] = useState("hoy");
  const { datos, cargando, error, recargar } = useApi(() => visitas(cuando), [cuando]);
  const [cambios, setCambios] = useState({});
  const puedeMarcar = yo.rol === "recepcion";

  const poner = async (id, estado) => {
    setCambios((c) => ({ ...c, [id]: estado }));
    try { await marcar(id, estado); } catch { setCambios((c) => ({ ...c, [id]: undefined })); }
  };

  return (
    <div className="m5">
      <div className="m5-chips" role="tablist" aria-label="Cuándo">
        {[["hoy", "Hoy"], ["proximos", "Próximos días"]].map(([v, t]) => (
          <button key={v} type="button" role="tab" aria-selected={cuando === v}
            className={`m5-chip ${cuando === v ? "m5-chip--on" : ""}`} onClick={() => setCuando(v)}>{t}</button>
        ))}
      </div>
      {!datos ? <ApiEstado cargando={cargando} error={error} reintentar={recargar} />
        : !datos.length ? <p className="card card--sunken m5-vacio">{cuando === "hoy" ? "Nadie tiene visita prevista para hoy." : "No hay visitas en los próximos días."}</p>
        : (
          <Panel>
            <div className="tablewrap">
              <table className="dt dt--stack">
                <thead><tr><th>Cuándo</th><th>Quién</th><th>Va a</th><th>Estado</th><th /></tr></thead>
                <tbody>
                  {datos.map((v) => {
                    const estado = cambios[v.id] || v.estado;
                    const [tono, txt] = ESTADO[estado] || ["neutral", estado];
                    return (
                      <tr key={v.id}>
                        <td className="dt__main">{cuando === "hoy" ? (v.franja === "mañana" ? "Mañana" : "Tarde") : `${fecha(v.fecha)} · ${v.franja}`}</td>
                        <td data-label="Quién"><strong>{v.nombre}</strong></td>
                        <td data-label="Va a">{v.modulo}</td>
                        <td data-label="Estado"><Badge tone={tono}>{txt}</Badge></td>
                        <td className="dt__end">
                          {puedeMarcar && estado === "por_llegar" && (
                            <span className="m5-acciones">
                              <Button size="sm" onClick={() => poner(v.id, "llego")}>Ya llegó</Button>
                              <Button size="sm" variant="link" onClick={() => poner(v.id, "no_vino")}>No vino</Button>
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      <p className="m5-nota">Las visitas las agenda el asistente cuando la usuaria elige «Prefiero ir en persona».</p>
    </div>
  );
}
