import { useState } from "react";
import { Panel } from "../../components/organisms";
import { ApiEstado, Dialog } from "../../components/molecules";
import { Badge, Button, Icon, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { llegada, marcar, visitas } from "./servicio.js";
import "./estilos.css";

const ESTADO = { por_llegar: ["warning", "Por llegar"], llego: ["success", "Llegó"], no_vino: ["neutral", "No vino"] };
const fecha = (iso) => new Intl.DateTimeFormat("es-MX", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${iso}T12:00:00`));

/** Recepción: quién va a llegar, cuándo y a qué módulo. Nunca el motivo. */
const CURP = /^[A-Z]{4}\d{6}[HMX][A-Z]{5}[A-Z0-9]\d$/;

/** Registrar a una mujer que llegó sin cita: se abre (o encuentra) su expediente y pasa a Trabajo Social. */
function RegistrarLlegada({ abierto, onCerrar, onListo }) {
  const [d, setD] = useState({ nombre: "", curp: "", telefono: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const enviar = async () => {
    setError("");
    if (d.nombre.trim().split(/\s+/).length < 2) return setError("Escribe su nombre completo.");
    if (!CURP.test(d.curp.trim())) return setError("Revisa la CURP: son 18 letras y números.");
    setEnviando(true);
    try {
      const r = await llegada({ nombre: d.nombre.trim(), curp: d.curp.trim(), telefono: d.telefono.trim() || null });
      setD({ nombre: "", curp: "", telefono: "" });
      onListo(r);
    } catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };
  return (
    <Dialog abierto={abierto} onCerrar={onCerrar} titulo="Registrar llegada"
      descripcion="Para una mujer que llegó sin cita. Trabajo Social la atiende y decide a qué área va. No le preguntes el motivo aquí."
      onSubmit={enviar}
      acciones={<><Button variant="ghost" onClick={onCerrar}>Cancelar</Button><Button type="submit" loading={enviando}>Enviar a Trabajo Social</Button></>}>
      <div className="m5-form">
        <Input label="Nombre completo" value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} />
        <Input label="CURP" maxLength={18} value={d.curp} hint="Si ya tiene expediente, se abre el que existe." onChange={(e) => setD({ ...d, curp: e.target.value.toUpperCase() })} />
        <Input label="Teléfono (opcional)" type="tel" value={d.telefono} onChange={(e) => setD({ ...d, telefono: e.target.value })} />
        {error && <p className="m5-error" role="alert">{error}</p>}
      </div>
    </Dialog>
  );
}

export default function Visitas({ yo }) {
  const [registrar, setRegistrar] = useState(false);
  const [aviso, setAviso] = useState("");
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
      {yo.rol === "recepcion" && (
        <div className="m5-barra">
          <Button onClick={() => setRegistrar(true)}><Icon name="mas" size={18} /> Registrar llegada</Button>
          {aviso && <p className="m5-ok" role="status">{aviso}</p>}
        </div>
      )}
      <RegistrarLlegada abierto={registrar} onCerrar={() => setRegistrar(false)}
        onListo={(r) => { setRegistrar(false); setAviso(`Listo: pasó a Trabajo Social (${r.folio}).${r.existente ? " Ya tenía expediente." : ""}`); recargar(); }} />
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
