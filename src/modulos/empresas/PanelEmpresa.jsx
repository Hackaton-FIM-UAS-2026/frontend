import { useCallback, useEffect, useState } from "react";
import { Link, Route, Routes } from "react-router-dom";
import { AdminTemplate, AuthTemplate } from "../../components/templates";
import { Button, Input } from "../../components/atoms";
import { salir, supabase } from "../../lib/supabase";
import { yo as pedirYo } from "./servicio.js";
import MisVacantes from "./MisVacantes.jsx";
import Candidatas from "./Candidatas.jsx";
import MiEmpresa from "./MiEmpresa.jsx";
import "./estilos.css";

const MENU = [
  { to: "/empresa", label: "Mis vacantes", icon: "maletin", end: true },
  { to: "/empresa/candidatas", label: "Candidatas", icon: "usuarias" },
  { to: "/empresa/mi-empresa", label: "Mi empresa", icon: "edificio" },
];

function Entrar({ onListo }) {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const entrar = async (e) => {
    e.preventDefault();
    setError(""); setEnviando(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: pass });
    if (err) { setError("Ese correo o contraseña no coinciden."); setEnviando(false); return; }
    onListo();
  };
  return (
    <AuthTemplate>
      <form onSubmit={entrar} className="m6-pila">
        <h1 className="m6-h1">Panel de empresas</h1>
        <Input id="emp-correo" type="email" label="Correo" autoComplete="username" value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Input id="emp-pass" type="password" label="Contraseña" autoComplete="current-password" value={pass}
          onChange={(e) => setPass(e.target.value)} error={error || undefined} />
        <Button block type="submit" loading={enviando}>Entrar</Button>
        <p className="m6-muted">¿Aún no te registras? <Link to="/empresas/registro">Registra tu empresa</Link></p>
      </form>
    </AuthTemplate>
  );
}

/** Panel de la empresa: misma anatomía que el panel de SEMujeres, con su propio menú. */
export default function PanelEmpresa() {
  const [estado, setEstado] = useState({ cargando: true });
  const revisar = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return setEstado({ sinSesion: true });
    try { setEstado({ empresa: await pedirYo() }); }
    catch (e) { setEstado({ error: e.status === 403 ? "Esta cuenta no es de una empresa." : e.status === 404 ? "Esta cuenta aún no tiene empresa registrada." : e.message }); }
  }, []);
  useEffect(() => { revisar(); }, [revisar]);
  const cerrar = async () => { await salir(); window.location.assign("/"); };

  if (estado.cargando) return <AuthTemplate><p className="m6-muted">Cargando…</p></AuthTemplate>;
  if (estado.sinSesion) return <Entrar onListo={revisar} />;
  if (estado.error) return (
    <AuthTemplate>
      <div className="m6-pila">
        <p className="m6-error" role="alert">{estado.error}</p>
        <Button to="/empresas/registro">Registrar una empresa</Button>
        <Button variant="ghost" onClick={cerrar}>Cerrar sesión</Button>
      </div>
    </AuthTemplate>
  );

  const emp = estado.empresa;
  return (
    <AdminTemplate titulo={emp.nombre} menu={MENU} marca="Empresas" onSalir={cerrar}
      persona={{ nombre: emp.nombre, rolTexto: emp.estado === "aprobada" ? "Empresa aprobada" : "Empresa en revisión" }}>
      <Routes>
        <Route index element={<MisVacantes empresa={emp} />} />
        <Route path="candidatas" element={<Candidatas />} />
        <Route path="mi-empresa" element={<MiEmpresa empresa={emp} />} />
      </Routes>
    </AdminTemplate>
  );
}
