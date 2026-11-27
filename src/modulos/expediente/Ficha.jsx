import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Avatar, Badge, Button, Icon, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { cita as programarCita, derivar, estadoCaso, expediente, nota } from "./servicio.js";
import { Candado, Urgencia } from "./comun.jsx";
import { Contacto } from "./Contacto.jsx";
import { fechaCita, MODALIDAD } from "../../services/fechas";
import "./estilos.css";
import { cap } from "../../services/texto";

const ESCRIBE_NOTAS = ["trabajo_social", "especialista_juridica", "especialista_psicologica"];
const DESTINOS = [["juridica", "Jurídico"], ["psicologica", "Psicología"], ["ambas", "Jurídico y Psicología"], ["economico", "Empoderamiento económico"]];
const ESTADOS_CASO = [["contactada", "Ya la contacté"], ["en atención", "En atención"], ["cerrada", "Concluir caso"]];
const ESPECIALISTAS = ["especialista_juridica", "especialista_psicologica"];

const manana = () => { const d = new Date(); d.setDate(d.getDate() + 1); return d.toLocaleDateString("en-CA"); };

/** Programar (o cambiar) la cita del caso. Si es en SEMujeres, Recepción la ve en Visitas previstas. */
function ProgramarCita({ folio, actual, onListo }) {
  const [abierto, setAbierto] = useState(!actual);
  const [d, setD] = useState({ fecha: manana(), hora: "10:00", modalidad: "presencial", nota: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const guardar = async () => {
    setError(""); setEnviando(true);
    try { await programarCita(folio, { ...d, nota: d.nota.trim() || null }); setAbierto(false); onListo(); }
    catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };
  if (!abierto) return <Button size="sm" variant="link" className="m4-auto" onClick={() => setAbierto(true)}>{actual ? "Cambiar la cita" : "Programar cita"}</Button>;
  return (
    <div className="m4-citaform">
      <div className="m4-citaform__fila">
        <Input type="date" label="Día" value={d.fecha} min={new Date().toLocaleDateString("en-CA")} onChange={(e) => setD({ ...d, fecha: e.target.value })} />
        <Input type="time" label="Hora" value={d.hora} step="900" onChange={(e) => setD({ ...d, hora: e.target.value })} />
      </div>
      <Input as="select" label="Cómo" value={d.modalidad} onChange={(e) => setD({ ...d, modalidad: e.target.value })}>
        <option value="presencial">En SEMujeres (presencial)</option><option value="llamada">Por llamada</option><option value="videollamada">Por videollamada</option>
      </Input>
      <Input label="Nota para la cita (opcional)" value={d.nota} maxLength={300} onChange={(e) => setD({ ...d, nota: e.target.value })} hint="Por ejemplo: traer su INE y acta de nacimiento." />
      {error && <p className="m4-error" role="alert">{error}</p>}
      <div className="m4-acciones">
        <Button size="sm" loading={enviando} onClick={guardar}>Guardar cita</Button>
        {actual && <Button size="sm" variant="link" onClick={() => setAbierto(false)}>Cancelar</Button>}
      </div>
    </div>
  );
}

/** Trabajo Social valora la situación y decide a qué departamento va el expediente. */
function Derivar({ id, onListo }) {
  const [area, setArea] = useState("");
  const [valoracion, setValoracion] = useState("");
  const [urgencia, setUrgencia] = useState("pronta");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const enviar = async () => {
    setError("");
    if (!area) return setError("Elige el departamento.");
    if (valoracion.trim().length < 10) return setError("Escribe tu valoración (al menos una frase).");
    setEnviando(true);
    try { const r = await derivar(id, { area, valoracion: valoracion.trim(), urgencia }); onListo(r); setArea(""); setValoracion(""); }
    catch (e) { setError(e.message); }
    finally { setEnviando(false); }
  };
  return (
    <Panel titulo="Enviar a un departamento" className="m4-derivar">
      <p className="muted small">Después de valorar su situación, elige quién la atiende. Tu valoración solo la ve Trabajo Social; la especialista recibe el resumen.</p>
      <Input as="textarea" rows={3} label="Tu valoración" value={valoracion} maxLength={1500} onChange={(e) => setValoracion(e.target.value)} />
      <p className="m4-subt">Enviar a</p>
      <div className="m4-destinos" role="radiogroup" aria-label="Departamento">
        {DESTINOS.map(([a, t]) => (
          <button key={a} type="button" role="radio" aria-checked={area === a} className={`m4-opcion ${area === a ? "m4-opcion--on" : ""}`} onClick={() => setArea(a)}>
            <span className="m4-opcion__radio" aria-hidden="true" />{t}
          </button>
        ))}
      </div>
      {area && area !== "economico" && (
        <Input as="select" label="Urgencia" value={urgencia} onChange={(e) => setUrgencia(e.target.value)}>
          <option value="inmediata">Inmediata</option><option value="pronta">Pronta</option><option value="informativa">Informativa</option>
        </Input>
      )}
      {error && <p className="m4-error" role="alert">{error}</p>}
      <Button className="m4-auto" loading={enviando} onClick={enviar}>Enviar expediente</Button>
    </Panel>
  );
}

function Datos({ filas }) {
  if (!filas?.length) return <p className="muted small">Sin datos todavía.</p>;
  return <dl className="m4-datos">{filas.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
}

export default function Ficha({ yo }) {
  const { id } = useParams();
  const nav = useNavigate();
  const { datos: e, cargando, error, recargar } = useApi(() => expediente(id), [id]);
  const [texto, setTexto] = useState("");
  const [ocupado, setOcupado] = useState("");
  const [aviso, setAviso] = useState("");

  if (!e) return <ApiEstado cargando={cargando} error={error} reintentar={recargar} />;
  const g = e.general;

  const cambiarEstado = async (folio, estado) => {
    setOcupado(folio + estado);
    try { await estadoCaso(folio, estado); setAviso(`Listo: ${folio} quedó «${estado}».`); recargar(); }
    catch (err) { setAviso(err.message); }
    finally { setOcupado(""); }
  };
  const guardarNota = async () => {
    if (!texto.trim()) return;
    setOcupado("nota");
    try { await nota(id, texto.trim()); setTexto(""); recargar(); }
    catch (err) { setAviso(err.message); }
    finally { setOcupado(""); }
  };

  return (
    <div className="m4-ficha">
      <Button variant="link" size="sm" className="m4-auto" onClick={() => nav(-1)}><Icon name="izq" size={18} /> Regresar</Button>
      <section className="card m4-cabeza">
        <Avatar nombre={g.nombre || "?"} size={64} />
        <div className="m4-cabeza__id">
          <h2>{g.nombre || "Sin nombre"}</h2>
          <p className="muted">{[g.curp && `CURP ${g.curp}`, g.colonia, g.municipio, g.desde && `Expediente desde ${g.desde}`].filter(Boolean).join(" · ")}</p>
        </div>
        <div className="m4-cabeza__badges">
          {e.solicitudes.slice(0, 1).map((s) => <span key={s.folio}><Badge tone="primary">Folio {s.folio}</Badge> <Urgencia valor={s.urgencia} /></span>)}
        </div>
      </section>
      {aviso && <p className="m4-aviso" role="status">{aviso}</p>}

      <div className="m4-cols">
        <div className="m4-col">
          {e.solicitudes.map((s) => (
            <Panel key={s.folio} titulo="Lo que nos contó">
              <p className="muted small">Resumen que ella aprobó · {s.fecha} · {s.folio}</p>
              <p className="m4-resumen">{s.resumen || "Sin resumen."}</p>
              {s.contacto && <Datos filas={[["Contacto seguro", [s.contacto.medio, s.contacto.horario].filter(Boolean).join(" · ") || "—"],
                ["¿Dejar mensaje?", s.contacto.mensaje ? "Sí" : "No"]]} />}
              {s.area_asignada && (
                <div className="m4-cita">
                  <p className="m4-subt">Cita</p>
                  {s.cita
                    ? <p className="m4-cita__cuando"><Icon name="calendario" size={18} /> <b>{fechaCita(s.cita.fecha)}</b> · {MODALIDAD[s.cita.modalidad]}{s.cita.nota ? <small>{s.cita.nota}</small> : null}</p>
                    : <p className="muted small">Todavía no tiene cita.</p>}
                  {[...ESPECIALISTAS, "trabajo_social"].includes(yo.rol) && s.estado !== "cerrada" && (
                    <ProgramarCita key={s.cita?.fecha || "nueva"} folio={s.folio} actual={s.cita} onListo={() => { setAviso(`Listo: cita guardada (${s.folio}).`); recargar(); }} />
                  )}
                </div>
              )}
              {ESPECIALISTAS.includes(yo.rol) && s.estado !== "cerrada" && (
                <>
                  <p className="m4-subt">Estado del caso: {cap(s.estado)}</p>
                  <div className="m4-acciones">
                    {ESTADOS_CASO.filter(([e]) => e !== s.estado).map(([e, t]) => (
                      <Button key={e} size="sm" variant={e === "cerrada" ? "ghost" : "quiet"} loading={ocupado === s.folio + e}
                        onClick={() => cambiarEstado(s.folio, e)}>{t}</Button>
                    ))}
                  </div>
                </>
              )}
            </Panel>
          ))}
          {yo.rol === "trabajo_social" && (
            <Derivar id={id} onListo={(r) => { setAviso(r.area === "economico" ? "Listo: la enviaste a Empoderamiento económico." : `Listo: expediente enviado (${r.folio}).`); recargar(); }} />
          )}
          {e.bloqueos.map((b) => <Candado key={b}>{b}</Candado>)}
          <Panel titulo="Datos generales"><Datos filas={g.datos} /></Panel>
          {e.economico && (
            <Panel titulo="Empoderamiento económico">
              <Datos filas={e.economico.datos} />
              {e.economico.recursos.length > 0 && (
                <ul className="m4-linea">{e.economico.recursos.map((r, i) => <li key={i}>{r.titulo}<small>{cap(r.estado)} · {r.fecha}</small></li>)}</ul>
              )}
            </Panel>
          )}
        </div>
        <div className="m4-col">
          {g.contacto && <Panel titulo="Cómo contactarla"><Contacto c={g.contacto} /></Panel>}
          <Panel titulo="Línea de tiempo">
            {e.eventos.length
              ? <ul className="m4-linea">{e.eventos.map((ev, i) => <li key={i}>{ev.texto}<small>{ev.fecha}</small></li>)}</ul>
              : <p className="muted small">Sin actividad todavía.</p>}
          </Panel>
          {ESCRIBE_NOTAS.includes(yo.rol) && (
            <Panel titulo="Notas de tu área">
              {e.notas.length > 0 && <ul className="m4-linea">{e.notas.map((n, i) => <li key={i}>{n.texto}<small>{n.fecha}</small></li>)}</ul>}
              <Input as="textarea" rows={3} label="Nueva nota" value={texto} maxLength={1500} onChange={(ev) => setTexto(ev.target.value)}
                hint="Solo la ve tu área." />
              <Button size="sm" className="m4-auto" loading={ocupado === "nota"} disabled={!texto.trim()} onClick={guardarNota}>Guardar nota</Button>
            </Panel>
          )}
        </div>
      </div>
    </div>
  );
}
