import { useState } from "react";
import { Link } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado, Dialog } from "../../components/molecules";
import { Button, Icon, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { crearVacante, vacantes } from "./servicio.js";
import { Estado } from "./comun.jsx";

const HORARIOS = ["Mañanas", "Tardes", "Noches", "Fines de semana", "Flexible"];
const ESCOLARIDAD = ["", "Primaria", "Secundaria", "Media superior", "Licenciatura"];
const DOCS = ["CURP", "INE", "RFC", "Comprobante de domicilio"];
const VACIA = { titulo: "", descripcion: "", horario: "Mañanas", sueldo: "", ubicacion: "Los Mochis", escolaridad_minima: "", documentos: [] };

function EditorVacante({ abierto, onCerrar, onGuardada }) {
  const [v, setV] = useState(VACIA);
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const campo = (k) => ({ value: v[k], onChange: (e) => setV({ ...v, [k]: e.target.value }) });
  const guardar = async () => {
    setError("");
    if (v.titulo.trim().length < 3 || v.descripcion.trim().length < 10 || !v.sueldo.trim() || !v.ubicacion.trim())
      return setError("Llena puesto, descripción (al menos 10 letras), sueldo y lugar.");
    setEnviando(true);
    try {
      await crearVacante({ ...v, titulo: v.titulo.trim(), descripcion: v.descripcion.trim(), sueldo: v.sueldo.trim(),
        ubicacion: v.ubicacion.trim(), escolaridad_minima: v.escolaridad_minima || null });
      setV(VACIA); onGuardada();
    } catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };
  return (
    <Dialog abierto={abierto} onCerrar={onCerrar} titulo="Nueva vacante" ancho
      descripcion="Una persona de SEMujeres la revisará antes de publicarla." onSubmit={guardar}
      acciones={<><Button variant="ghost" onClick={onCerrar}>Cancelar</Button><Button type="submit" loading={enviando}>Enviar a revisión</Button></>}>
      <div className="m6-pila">
        <Input label="Puesto" placeholder="Por ejemplo: Cajera" {...campo("titulo")} />
        <Input as="textarea" rows={3} label="¿Qué hará?" {...campo("descripcion")} />
        <div className="m6-dos">
          <Input as="select" label="Horario" {...campo("horario")}>{HORARIOS.map((h) => <option key={h}>{h}</option>)}</Input>
          <Input label="Sueldo" placeholder="$7,800 al mes" {...campo("sueldo")} />
        </div>
        <div className="m6-dos">
          <Input label="Lugar" {...campo("ubicacion")} />
          <Input as="select" label="Escolaridad mínima" {...campo("escolaridad_minima")}>
            {ESCOLARIDAD.map((x) => <option key={x} value={x}>{x || "No pide"}</option>)}
          </Input>
        </div>
        <fieldset className="m6-docs">
          <legend>Documentos que pide</legend>
          {DOCS.map((doc) => (
            <label key={doc} className="check-row">
              <input type="checkbox" checked={v.documentos.includes(doc)}
                onChange={(e) => setV({ ...v, documentos: e.target.checked ? [...v.documentos, doc] : v.documentos.filter((x) => x !== doc) })} />
              {doc}
            </label>
          ))}
        </fieldset>
        {error && <p className="m6-error" role="alert">{error}</p>}
      </div>
    </Dialog>
  );
}

export default function MisVacantes({ empresa }) {
  const { datos, cargando, error, recargar } = useApi(vacantes);
  const [abierto, setAbierto] = useState(false);
  const [aviso, setAviso] = useState("");
  return (
    <div className="m6-pila">
      {empresa.estado !== "aprobada" && (
        <p className="m6-aviso">{empresa.estado === "rechazada"
          ? <>Tu empresa no fue aprobada{empresa.motivo ? `: ${empresa.motivo}` : "."} Escríbenos para corregirlo.</>
          : "Tu empresa está en revisión. Puedes preparar vacantes; se publicarán cuando se apruebe."}</p>
      )}
      {aviso && <p className="m6-ok" role="status">{aviso}</p>}
      <div className="m6-fila"><Button onClick={() => setAbierto(true)}><Icon name="mas" size={18} /> Nueva vacante</Button></div>
      {!datos ? <ApiEstado cargando={cargando} error={error} reintentar={recargar} />
        : !datos.length ? <p className="card card--sunken m6-muted">Aún no tienes vacantes. Crea la primera.</p>
        : (
          <Panel>
            <div className="tablewrap">
              <table className="dt dt--stack">
                <thead><tr><th>Vacante</th><th>Horario</th><th>Estado</th><th>Candidatas</th></tr></thead>
                <tbody>
                  {datos.map((v) => (
                    <tr key={v.id}>
                      <td className="dt__main"><strong>{v.titulo}</strong>{v.motivo_revision && <><br /><small className="m6-muted">Motivo: {v.motivo_revision}</small></>}</td>
                      <td data-label="Horario">{v.horario}</td>
                      <td data-label="Estado"><Estado valor={v.estado_revision} /></td>
                      <td data-label="Candidatas">{v.candidatas ? <Link to={`/empresa/candidatas?v=${v.id}`}>{v.candidatas}</Link> : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
      <EditorVacante abierto={abierto} onCerrar={() => setAbierto(false)}
        onGuardada={() => { setAbierto(false); setAviso("Listo. Tu vacante quedó en revisión."); recargar(); }} />
    </div>
  );
}
