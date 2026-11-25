import { useState } from "react";
import { Badge, Button, Icon, Avatar, Input } from "../atoms";
import { NOMBRE_RUTA } from "../../services/motorRuta";

/* ===== Piezas del panel CEMujeres (datos ficticios) ===== */

export function Panel({ titulo, accion, children, className = "" }) {
  return (
    <section className={`card pnl ${className}`}>
      {(titulo || accion) && <header className="pnl__head"><h2>{titulo}</h2>{accion}</header>}
      {children}
    </section>
  );
}

export function KpiCard({ titulo, valor, detalle, lista }) {
  return (
    <section className="card card--brand kpi">
      <h2 className="kpi__titulo">{titulo}</h2>
      <strong>{valor}</strong>
      {detalle && <span className="kpi__detalle">{detalle}</span>}
      <ul>
        {lista.map((l) => (
          <li key={l.label}><i style={{ background: l.color }} /> {l.label}<b>{l.valor}</b></li>
        ))}
      </ul>
    </section>
  );
}

export function BarChart({ semanas, series }) {
  const W = 480, H = 230, L = 32, B = 28, T = 12, R = 8;
  const max = Math.ceil(Math.max(...series.flatMap((s) => s.datos)) / 5) * 5;
  const bw = 14, gap = 4, gw = (W - L - R) / semanas.length;
  const y = (v) => T + (H - T - B) * (1 - v / max);
  const ticks = [0, 1, 2, 3, 4].map((n) => (max / 4) * n);
  return (
    <div>
      <svg className="chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Usuarias nuevas por semana y por ruta">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeDasharray="3 4" />
            <text x={L - 6} y={y(t) + 4} textAnchor="end" fontSize="11" fill="var(--text-muted)">{Math.round(t)}</text>
          </g>
        ))}
        {semanas.map((s, gi) => {
          const x0 = L + gi * gw + (gw - (3 * bw + 2 * gap)) / 2;
          return (
            <g key={s}>
              {series.map((serie, si) => (
                <rect key={serie.nombre} x={x0 + si * (bw + gap)} y={y(serie.datos[gi])} width={bw}
                  height={H - B - y(serie.datos[gi])} rx="3" fill={serie.color} />
              ))}
              <text x={L + gi * gw + gw / 2} y={H - 8} textAnchor="middle" fontSize="11" fill="var(--text-muted)">{s}</text>
            </g>
          );
        })}
      </svg>
      <div className="legend">
        {series.map((s) => <span key={s.nombre}><i style={{ background: s.color }} />{s.nombre}</span>)}
      </div>
    </div>
  );
}

export function MiniCalendar({ marcas }) {
  const primero = new Date(2026, 10, 1).getDay();
  const offset = (primero + 6) % 7;                  // semana inicia en lunes
  const dias = [...Array(offset).fill(null), ...Array.from({ length: 30 }, (_, i) => i + 1)];
  return (
    <section className="cal">
      <header><Icon name="calendario" size={20} /> <strong>Noviembre 2026</strong></header>
      <div className="cal__grid">
        {["L", "M", "M", "J", "V", "S", "D"].map((d, i) => <span key={i} className="cal__dow">{d}</span>)}
        {dias.map((d, i) => (
          <span key={i} className={`cal__day ${d && marcas[d] ? `cal__day--${marcas[d]}` : ""}`}>{d}</span>
        ))}
      </div>
      <footer><i className="cal__day--hoy" /> Hoy · <i className="cal__day--naranja" /> Seguimientos</footer>
    </section>
  );
}

const TONO_ESTADO = { Nueva: "primary", Inscrita: "warning", "En curso": "warning", Contratada: "success", "Curso terminado": "success" };

export function UsersTable({ usuarias, onOpen, compact }) {
  return (
    <div className="tablewrap">
      <table className="dt">
        <thead>
          <tr><th>Usuaria</th><th>Ruta</th>{!compact && <><th>Estado</th><th>Municipio</th><th>Última actividad</th></>}<th /></tr>
        </thead>
        <tbody>
          {usuarias.map((u) => (
            <tr key={u.id}>
              <td><span className="who"><Avatar nombre={u.nombre} size={34} />{u.nombre}</span></td>
              <td><Badge tone={u.ruta}>{NOMBRE_RUTA[u.ruta]}</Badge></td>
              {!compact && <><td><Badge tone={TONO_ESTADO[u.estado] || "primary"}>{u.estado}</Badge></td><td>{u.municipio}</td><td>{u.ultima}</td></>}
              <td><button type="button" className="dt__link" onClick={() => onOpen(u.id)}>Ver ficha</button></td>
            </tr>
          ))}
          {!usuarias.length && <tr><td colSpan="6" className="dt__empty">Sin resultados.</td></tr>}
        </tbody>
      </table>
    </div>
  );
}

const ORDEN = { inmediata: 0, pronta: 1, informativa: 2 };
const TONO_URG = { inmediata: "danger", pronta: "warning", informativa: "primary" };

export function CasosTable({ casos, onCambiar }) {
  return (
    <div className="tablewrap">
      <table className="dt">
        <thead><tr><th>Caso</th><th>Urgencia</th><th>Tipo</th><th>Contacto seguro</th><th>Estado</th></tr></thead>
        <tbody>
          {[...casos].sort((a, b) => ORDEN[a.urgencia] - ORDEN[b.urgencia]).map((c) => (
            <tr key={c.id}>
              <td><strong>{c.id}</strong><br /><small className="muted">{c.fecha}</small></td>
              <td><Badge tone={TONO_URG[c.urgencia]} dot>{c.urgencia}</Badge></td>
              <td>{c.tipo}</td>
              <td>{c.medio}<br /><small className="muted">{c.horario}</small></td>
              <td>
                <select className="sel" value={c.estado} onChange={(e) => onCambiar(c.id, e.target.value)} aria-label={`Estado del caso ${c.id}`}>
                  {["nueva", "contactada", "en atención", "cerrada"].map((s) => <option key={s}>{s}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CasosCompactos({ casos }) {
  return (
    <ul className="contacts">
      {casos.slice(0, 4).map((c) => (
        <li key={c.id}>
          <Avatar nombre={c.usuaria} size={38} />
          <span><strong>{c.id} · {c.tipo}</strong><small>{c.estado} · {c.fecha}</small></span>
          <Badge tone={TONO_URG[c.urgencia]} dot>{c.urgencia}</Badge>
        </li>
      ))}
    </ul>
  );
}

export function ActivityFeed({ items }) {
  return (
    <ul className="feed">
      {items.map((a, i) => (
        <li key={i}>
          <Avatar nombre={a.quien} size={38} />
          <div>
            <p><strong>{a.quien}</strong> <small>{a.rol}</small></p>
            <p>{a.texto}</p>
            <small className="muted">{a.hora}</small>
          </div>
        </li>
      ))}
    </ul>
  );
}

const SITUACIONES = ["Inscrita", "En curso", "Curso terminado", "Contratada", "Negocio registrado"];

export function UserFicha({ usuaria, onVolver, onRegistrar }) {
  const [estado, setEstado] = useState(usuaria.estado);
  const [nota, setNota] = useState("");
  return (
    <div className="ficha2">
      <button type="button" className="dt__link" onClick={onVolver}><Icon name="izq" size={16} /> Volver a usuarias</button>
      <Panel className="ficha2__head">
        <Avatar nombre={usuaria.nombre} size={72} />
        <div>
          <h2>{usuaria.nombre}</h2>
          <p className="muted">{usuaria.municipio} · Expediente v{usuaria.version}</p>
          <p>
            <Badge tone={usuaria.ruta}>{NOMBRE_RUTA[usuaria.ruta]}</Badge>{" "}
            {usuaria.puente && <>+ puente <Badge tone={usuaria.puente}>{NOMBRE_RUTA[usuaria.puente]}</Badge></>}
          </p>
        </div>
      </Panel>
      <div className="ficha2__cols">
        <Panel titulo="Expediente económico">
          <dl className="datos">
            {Object.entries(usuaria.campos).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
        </Panel>
        <Panel titulo="Actualizar situación">
          <Input as="select" label="Situación" value={estado} onChange={(e) => setEstado(e.target.value)}>
            {SITUACIONES.map((s) => <option key={s}>{s}</option>)}
          </Input>
          <Input as="textarea" label="Nota" rows="3" value={nota} onChange={(e) => setNota(e.target.value)} />
          <Button onClick={() => { onRegistrar(usuaria.id, estado, nota); setNota(""); }}>Guardar</Button>
          <p className="muted small pnl__nota">Queda con la fuente «personal_cemujeres» y la versión del expediente sube. Si choca con lo que dijo ella, se marca para revisar.</p>
        </Panel>
      </div>
      <Panel titulo="Línea de tiempo">
        <ul className="timeline">
          {usuaria.historial.map((h, i) => (
            <li key={i}><b>{h.fecha}</b><span>{h.texto}</span><Badge tone="primary">{h.fuente}</Badge></li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}

export function CatalogTable({ recursos, vencidos, onToggle }) {
  return (
    <div className="tablewrap">
      <table className="dt">
        <thead><tr><th>Recurso</th><th>Tipo</th><th>Rutas</th><th>Cierre</th><th>Verificado</th><th>Estado</th></tr></thead>
        <tbody>
          {recursos.map((r) => {
            const v = vencidos.includes(r.id);
            return (
              <tr key={r.id}>
                <td><strong>{r.titulo}</strong><br /><small className="muted">{r.proveedor}</small></td>
                <td>{r.tipo}</td>
                <td>{r.rutas.map((x) => <Badge key={x} tone={x}>{NOMBRE_RUTA[x]}</Badge>)}</td>
                <td>{r.fecha_cierre}</td>
                <td>{r.verificado_el}</td>
                <td>
                  <button type="button" className={`toggle ${v ? "" : "toggle--on"}`} onClick={() => onToggle(r.id)} aria-pressed={!v}>
                    {v ? "Vencido" : "Vigente"}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export function ProgressList({ items }) {
  return (
    <ul className="plist">
      {items.map((i) => (
        <li key={i.label}>
          <span>{i.label}<b>{i.valor}%</b></span>
          <div className="plist__bar"><div style={{ width: `${i.valor}%`, background: i.color }} /></div>
        </li>
      ))}
    </ul>
  );
}
