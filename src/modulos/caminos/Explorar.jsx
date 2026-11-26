import { useEffect, useState } from "react";
import { AppTemplate } from "../../components/templates";
import { ApiEstado } from "../../components/molecules";
import { Button, Icon } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { catalogo } from "./servicio.js";
import { Tarjeta } from "./Tarjeta.jsx";
import "./estilos.css";

const TIPOS = [["vacante", "Vacantes"], ["curso", "Cursos"], ["beca_apoyo", "Becas y apoyos"]];
const HORARIOS = [["Mañanas", "Mañana"], ["Tardes", "Tarde"], ["Noches", "Noche"], ["Fines de semana", "Fines de semana"]];
const VACIO = { tipo: "", horario: "", gratis: false, en_linea: false };

function Chip({ on, children, onClick }) {
  return <button type="button" className={`m3-chip ${on ? "m3-chip--on" : ""}`} aria-pressed={on} onClick={onClick}>{children}</button>;
}

export default function Explorar() {
  const [f, setF] = useState(VACIO);
  const [q, setQ] = useState("");
  const [qListo, setQListo] = useState("");
  useEffect(() => { const t = setTimeout(() => setQListo(q.trim()), 350); return () => clearTimeout(t); }, [q]);
  const { datos, cargando, error, recargar } = useApi(() => catalogo({ ...f, q: qListo }), [f, qListo]);
  const alternar = (k, v) => setF((x) => ({ ...x, [k]: x[k] === v ? (typeof v === "boolean" ? false : "") : v }));
  const hayFiltros = q || f.tipo || f.horario || f.gratis || f.en_linea;

  const filtros = (
    <div className="m3-filtros">
      <span className="m3-filtros__t">Tipo</span>
      <div className="m3-chips">{TIPOS.map(([v, t]) => <Chip key={v} on={f.tipo === v} onClick={() => alternar("tipo", v)}>{t}</Chip>)}</div>
      <span className="m3-filtros__t">Horario</span>
      <div className="m3-chips">{HORARIOS.map(([v, t]) => <Chip key={v} on={f.horario === v} onClick={() => alternar("horario", v)}>{t}</Chip>)}</div>
      <span className="m3-filtros__t">Otros</span>
      <div className="m3-chips">
        <Chip on={f.gratis} onClick={() => alternar("gratis", true)}>Gratis</Chip>
        <Chip on={f.en_linea} onClick={() => alternar("en_linea", true)}>En línea</Chip>
      </div>
    </div>
  );

  return (
    <AppTemplate wide publica>
      <h1 className="m3-h1">Explorar</h1>
      <div className="m3-explorar">
        <aside className="m3-explorar__filtros">{filtros}</aside>
        <div className="m3-col">
          <label className="m3-buscar">
            <Icon name="buscar" size={20} />
            <span className="visually-hidden">Buscar</span>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Busca: cocina, Excel, beca…" />
          </label>
          <div className="m3-filtros-movil">{filtros}</div>
          {datos ? (
            <>
              <p className="m3-muted" role="status">{datos.length === 1 ? "1 opción" : `${datos.length} opciones`}</p>
              {datos.length
                ? <div className="m3-rejilla">{datos.map((r) => <Tarjeta key={r.id} r={r} />)}</div>
                : <div className="card card--sunken m3-vacio">
                    <p className="m3-muted">No encontramos opciones con esos filtros.</p>
                    {hayFiltros && <Button variant="ghost" onClick={() => { setF(VACIO); setQ(""); }}>Quitar filtros</Button>}
                  </div>}
            </>
          ) : <ApiEstado cargando={cargando} error={error} reintentar={recargar} />}
        </div>
      </div>
    </AppTemplate>
  );
}
