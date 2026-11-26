import { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Avatar, Button, Icon, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { alta, buscar } from "./servicio.js";
import { Vacio } from "./comun.jsx";
import Ficha from "./Ficha.jsx";
import "./estilos.css";

const CURP = /^[A-Za-z]{4}\d{6}[A-Za-z0-9]{8}$/;

function AltaPresencial({ onListo }) {
  const [d, setD] = useState({ nombre: "", curp: "", telefono: "" });
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const enviar = async (e) => {
    e.preventDefault();
    setError("");
    if (d.nombre.trim().length < 2) return setError("Escribe su nombre.");
    if (!CURP.test(d.curp.trim())) return setError("La CURP tiene 18 caracteres.");
    setEnviando(true);
    try { onListo(await alta({ nombre: d.nombre.trim(), curp: d.curp.trim().toUpperCase(), telefono: d.telefono.trim() || null })); }
    catch (err) { setError(err.message); setEnviando(false); }
  };
  return (
    <Panel titulo="Registrar a una mujer que llegó en persona">
      <form className="m4-alta" onSubmit={enviar} noValidate>
        <Input label="Nombre completo" value={d.nombre} onChange={(e) => setD({ ...d, nombre: e.target.value })} />
        <Input label="CURP" value={d.curp} maxLength={18} onChange={(e) => setD({ ...d, curp: e.target.value.toUpperCase() })}
          hint="Si ya tiene expediente, se abre el que existe." />
        <Input label="Teléfono (opcional)" type="tel" value={d.telefono} onChange={(e) => setD({ ...d, telefono: e.target.value })} error={error || undefined} />
        <Button type="submit" loading={enviando}>Abrir expediente</Button>
      </form>
    </Panel>
  );
}

function Lista({ yo }) {
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [qListo, setQListo] = useState("");
  const [alta, setAlta] = useState(false);
  useEffect(() => { const t = setTimeout(() => setQListo(q.trim()), 350); return () => clearTimeout(t); }, [q]);
  const { datos, cargando, error, recargar } = useApi(() => buscar(qListo), [qListo]);
  const esTS = yo.rol === "trabajo_social";
  return (
    <div className="m4-col">
      <label className="m4-buscador">
        <Icon name="buscar" size={18} /><span className="visually-hidden">Buscar</span>
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre o CURP" />
      </label>
      {!datos ? <ApiEstado cargando={cargando} error={error} reintentar={recargar} />
        : datos.length ? (
          <Panel>
            <ul className="m4-lista">
              {datos.map((p) => (
                <li key={p.usuaria_id}>
                  <button type="button" className="m4-persona" onClick={() => nav(p.usuaria_id)}>
                    <Avatar nombre={p.nombre || "?"} size={40} />
                    <span><strong>{p.nombre || "Sin nombre"}</strong><small>{[p.curp, p.colonia, p.municipio].filter(Boolean).join(" · ")}</small></span>
                    <Icon name="der" size={18} />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ) : <Vacio>No encontramos a nadie con esa búsqueda.</Vacio>}
      {esTS && (alta
        ? <AltaPresencial onListo={(r) => nav(r.usuaria_id)} />
        : <Button variant="ghost" className="m4-auto" onClick={() => setAlta(true)}><Icon name="mas" size={18} /> Registrar a una mujer que llegó en persona</Button>)}
    </div>
  );
}

/** Expedientes: búsqueda por nombre o CURP y ficha por área. */
export default function Expedientes({ yo }) {
  return (
    <Routes>
      <Route index element={<Lista yo={yo} />} />
      <Route path=":id" element={<Ficha yo={yo} />} />
    </Routes>
  );
}
