import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Avatar, Badge, Button, Icon, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { asignar, expediente, nota } from "./servicio.js";
import { Candado, Urgencia } from "./comun.jsx";
import "./estilos.css";

const ESCRIBE_NOTAS = ["trabajo_social", "especialista_juridica", "especialista_psicologica"];
const AREAS = [["juridica", "Jurídico"], ["psicologica", "Psicología"], ["ambas", "Ambas"]];

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

  const hacerAsignar = async (folio, area) => {
    setOcupado(folio + area);
    try { await asignar(folio, area); setAviso(`Listo: ${folio} quedó asignada.`); recargar(); }
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
              {yo.rol === "trabajo_social" && s.estado === "nueva" && (
                <>
                  <p className="m4-subt">Asignar a</p>
                  <div className="m4-acciones">
                    {AREAS.map(([a, t], i) => (
                      <Button key={a} variant={i === 0 ? "primary" : "ghost"} loading={ocupado === s.folio + a}
                        onClick={() => hacerAsignar(s.folio, a)}>{t}</Button>
                    ))}
                  </div>
                </>
              )}
            </Panel>
          ))}
          {e.bloqueos.map((b) => <Candado key={b}>{b}</Candado>)}
          <Panel titulo="Datos generales"><Datos filas={g.datos} /></Panel>
          {e.economico && (
            <Panel titulo="Empoderamiento económico">
              <Datos filas={e.economico.datos} />
              {e.economico.recursos.length > 0 && (
                <ul className="m4-linea">{e.economico.recursos.map((r, i) => <li key={i}>{r.titulo}<small>{r.estado} · {r.fecha}</small></li>)}</ul>
              )}
            </Panel>
          )}
        </div>
        <div className="m4-col">
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
