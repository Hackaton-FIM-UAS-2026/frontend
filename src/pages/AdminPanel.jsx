import { useCallback, useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Link, Navigate } from "react-router-dom";
import { AdminTemplate, AuthTemplate, MENU_BASE } from "../components/templates";
import { seccionesPanel } from "../modulos/registro";
import { Button, Icon, Input } from "../components/atoms";
import {
  Panel, KpiCard, BarChart, MiniCalendar, UsersTable, CasosTable, CasosCompactos,
  ActivityFeed, UserFicha, CatalogTable, ProgressList,
  SeguimientoList, ContactarDialog, necesitaSeguimiento,
  OfertasTable, OfertaEditor, estadoOferta,
} from "../components/organisms";
import { SEMANAS, SERIES, MARCAS_CALENDARIO } from "../data/admin";
import { exportarCSV } from "../services/exportar";
import { supabase, salir } from "../lib/supabase";
import { api } from "../services/api";

const ROL_TEXTO = {
  asesora_economica: "Empoderamiento económico",
  especialista_juridica: "Especialista jurídica",
  especialista_psicologica: "Especialista psicológica",
  coordinacion: "Coordinación",
  trabajo_social: "Trabajo Social",
  recepcion: "Recepción",
};
// Roles que usan el panel base (resumen, usuarias, ofertas, canalizaciones, catálogo, métricas)
const ROLES_BASE = ["asesora_economica", "especialista_juridica", "especialista_psicologica", "coordinacion"];
const COLOR_RUTA = { empleabilidad: "var(--turquesa-500)", emprendimiento: "var(--naranja-500)", capacitacion: "var(--magenta-500)" };
const NOMBRE = { empleabilidad: "Empleabilidad", emprendimiento: "Emprendimiento", capacitacion: "Capacitación" };

/** Puerta del panel: sesión de Supabase + rol del personal (GET /admin/yo). */
export default function AdminPanel() {
  const [yo, setYo] = useState(undefined); // undefined = revisando, null = sin sesión de personal

  const revisar = useCallback(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) return setYo(null);
    try { setYo(await api.admin.yo()); } catch { setYo(null); }
  }, []);
  useEffect(() => { revisar(); }, [revisar]);

  if (yo === undefined) return <AuthTemplate><p className="muted">Cargando…</p></AuthTemplate>;
  if (!yo) return <AdminLogin onListo={setYo} />;
  return <PanelInterno yo={yo} onSalir={async () => { await salir(); window.location.assign("/"); }} />;
}

function AdminLogin({ onListo }) {
  const [correo, setCorreo] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);
  const entrar = async (e) => {
    e.preventDefault();
    setError("");
    setEnviando(true);
    try {
      const { error: err } = await supabase.auth.signInWithPassword({ email: correo.trim(), password: pass });
      if (err) throw err;
      try {
        onListo(await api.admin.yo());
      } catch (e2) {
        await salir();
        throw new Error(e2.status === 403 ? "Esta cuenta no es del personal de SEMujeres." : e2.message);
      }
    } catch (err) {
      setError(/invalid/i.test(err.message) ? "Correo o contraseña incorrectos." : err.message);
    } finally {
      setEnviando(false);
    }
  };
  return (
    <AuthTemplate>
      <form onSubmit={entrar}>
        <h1>Panel SEMujeres</h1>
        <p className="muted auth__lead">Acceso solo para el personal.</p>
        <Input id="adm-correo" type="email" label="Correo" autoComplete="username" required value={correo} onChange={(e) => setCorreo(e.target.value)} />
        <Input id="adm-pass" type="password" label="Contraseña" autoComplete="current-password" required
          value={pass} onChange={(e) => setPass(e.target.value)} error={error || undefined} />
        <Button block type="submit" loading={enviando}>Entrar</Button>
        <p className="small"><Link to="/">Volver al sitio</Link></p>
      </form>
    </AuthTemplate>
  );
}

function PanelInterno({ yo, onSalir }) {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const esAsesora = yo.rol === "asesora_economica";
  const esEspecialista = yo.rol === "especialista_juridica" || yo.rol === "especialista_psicologica";
  const editaCatalogo = esAsesora || yo.rol === "coordinacion";

  const [usuarias, setUsuarias] = useState([]);
  const [casos, setCasos] = useState([]);
  const [actividad, setActividad] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [metr, setMetr] = useState(null);
  const [vencidos, setVencidos] = useState([]);
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const [filtroU, setFiltroU] = useState("todas");
  const [qOf, setQOf] = useState("");
  const [filtroOf, setFiltroOf] = useState("todas");
  const [editor, setEditor] = useState({ abierto: false, oferta: null, n: 0 });
  const [contacto, setContacto] = useState({ id: null, n: 0 });
  const [aviso, setAviso] = useState("");

  const fallo = (e) => setAviso(e?.message || "Algo salió mal.");
  const cargarCatalogo = useCallback(() => api.admin.recursos().then(setCatalogo).catch(fallo), []);

  const usaBase = ROLES_BASE.includes(yo.rol);
  const secciones = seccionesPanel.filter((x) => x.roles.includes(yo.rol));

  useEffect(() => {
    if (!usaBase) return;
    if (esAsesora) api.admin.usuarias().then(setUsuarias).catch(fallo);
    if (esEspecialista) api.admin.canalizaciones().then(setCasos).catch(fallo);
    cargarCatalogo();
    api.admin.metricas().then(setMetr).catch(() => {});
  }, [usaBase, esAsesora, esEspecialista, cargarCatalogo]);

  const abiertos = casos.filter((c) => c.estado !== "cerrada").length;
  const pendientes = usuarias.filter(necesitaSeguimiento);
  const ofertas = catalogo.filter((r) => r.tipo === "vacante");
  const publicadas = ofertas.filter((o) => o.publicada !== false).length;

  const bitacora = (texto) => setActividad((a) => [{ quien: yo.nombre, rol: ROL_TEXTO[yo.rol], texto, hora: "Ahora" }, ...a]);
  const reemplazar = (ficha) => setUsuarias((us) => us.map((u) => (u.id === ficha.id ? ficha : u)));

  const cambiarCaso = async (id, estado) => {
    try {
      const c = await api.admin.actualizarCaso(id, { estado });
      setCasos((cs) => cs.map((x) => (x.id === id ? { ...x, ...c } : x)));
    } catch (e) { fallo(e); }
  };
  const registrar = async (id, estado, nota) => {
    try { reemplazar(await api.admin.situacion(id, { estado, nota: nota || null })); bitacora(`Registró «${estado.toLowerCase()}».`); }
    catch (e) { fallo(e); }
  };
  const registrarContacto = async (id, { medio, resultado, nota }) => {
    const u = usuarias.find((x) => x.id === id);
    try {
      reemplazar(await api.admin.contacto(id, { medio, resultado, nota: nota || null }));
      bitacora(`Contactó a ${u?.nombre} por ${medio.toLowerCase()} (${resultado.toLowerCase()}).`);
    } catch (e) { fallo(e); }
    setContacto((c) => ({ ...c, id: null }));
  };
  const abrirContacto = (id) => setContacto((c) => ({ id, n: c.n + 1 }));

  const toggleVencido = (id) => setVencidos(vencidos.includes(id) ? vencidos.filter((x) => x !== id) : [...vencidos, id]);
  const abrirEditor = (oferta = null) => setEditor((e) => ({ abierto: true, oferta, n: e.n + 1 }));
  const guardar = async (oferta) => {
    try {
      const g = await api.admin.guardarRecurso(oferta);
      await cargarCatalogo();
      setEditor((e) => ({ ...e, abierto: false }));
      bitacora(`${oferta.id ? "Editó" : "Publicó"} la oferta «${g.titulo}».`);
    } catch (e) { fallo(e); }
  };
  const publicar = async (id, publicada) => {
    try {
      const o = await api.admin.publicar(id, publicada);
      await cargarCatalogo();
      bitacora(`${publicada ? "Publicó" : "Pausó"} la oferta «${o.titulo}».`);
    } catch (e) { fallo(e); }
  };

  const exportarUsuarias = () => exportarCSV("usuarias_empoderate",
    ["Nombre", "Ruta", "Estado", "Municipio", "Última actividad", "Teléfono", "Correo", "Medio preferido"],
    usuarias.map((u) => [u.nombre, u.ruta, u.estado, u.municipio, u.ultima, u.contacto.telefono, u.contacto.correo, u.contacto.medio]));
  const exportarCasos = () => exportarCSV("canalizaciones_empoderate",
    ["Caso", "Urgencia", "Tipo", "Medio", "Horario", "Estado", "Fecha"],
    casos.map((c) => [c.id, c.urgencia, c.tipo, c.medio, c.horario, c.estado, c.fecha]));
  const exportarOfertas = () => exportarCSV("ofertas_empoderate",
    ["Puesto", "Empresa", "Modalidad", "Horario", "Horas/semana", "Sueldo", "Ubicación", "Cierre", "Estado"],
    ofertas.map((o) => [o.titulo, o.proveedor, o.modalidad, o.horario, o.horas_semana ?? "", o.costo, o.ubicacion, o.fecha_cierre, estadoOferta(o).label]));
  const btnExcel = (onClick) => <Button variant="ghost" size="sm" onClick={onClick}><Icon name="descargar" size={18} /> Exportar a Excel</Button>;

  const filtradas = usuarias
    .filter((u) => u.nombre.toLowerCase().includes(q.toLowerCase()))
    .filter((u) => (filtroU === "seguimiento" ? necesitaSeguimiento(u) : true));
  const ofertasFiltradas = useMemo(() => ofertas
    .filter((o) => `${o.titulo} ${o.proveedor}`.toLowerCase().includes(qOf.toLowerCase()))
    .filter((o) => filtroOf === "todas" || (filtroOf === "publicadas" ? o.publicada !== false : o.publicada === false)),
  [ofertas, qOf, filtroOf]);
  const fichaSel = usuarias.find((u) => u.id === sel);
  const usuariaContacto = usuarias.find((u) => u.id === contacto.id);
  // La lista no trae historial: al abrir la ficha se pide completa (queda en bitácora)
  const verFicha = async (id) => {
    setSel(id);
    try { reemplazar(await api.admin.usuaria(id)); } catch (e) { fallo(e); }
  };
  const abrirFicha = (id) => { verFicha(id); nav("/admin/usuarias"); };

  const porRuta = metr?.usuarias_por_ruta || {};
  const totalUsuarias = Object.values(porRuta).reduce((a, b) => a + b, 0);
  const listaRutas = Object.keys(NOMBRE).map((k) => ({ label: NOMBRE[k], valor: porRuta[k] || 0, color: COLOR_RUTA[k] }));
  const acciones = metr?.acciones || {};

  const pulso = [
    esAsesora && ["Para dar seguimiento", pendientes.length, "/admin/usuarias", "usuarias", () => setFiltroU("seguimiento")],
    ["Ofertas de trabajo publicadas", publicadas, "/admin/ofertas", "maletin"],
    esEspecialista && ["Canalizaciones abiertas", abiertos, "/admin/bandeja", "bandeja"],
  ].filter(Boolean);

  const resumen = () => (
    <>
      <nav className="pulso" aria-label="Pendientes">
        {pulso.map(([label, n, to, icon, onClick]) => (
          <Link key={label} to={to} onClick={onClick} className="card card--link pulso__item">
            <span className="pulso__icon"><Icon name={icon} size={20} /></span>
            <span className="pulso__n">{n}</span>
            <span className="pulso__label">{label}</span>
            <Icon name="der" size={18} className="pulso__go" />
          </Link>
        ))}
      </nav>
      <div className="adm__row adm__row--segui">
        {esAsesora && (
          <Panel titulo="Para dar seguimiento" accion={<Button variant="link" size="sm" to="/admin/usuarias" onClick={() => setFiltroU("seguimiento")}>Ver todas</Button>}>
            <SeguimientoList usuarias={pendientes.slice(0, 5)} onAbrir={abrirFicha} onContactar={abrirContacto} />
          </Panel>
        )}
        <div className="adm__stack">
          <Panel titulo="Actividad reciente">
            {actividad.length ? <ActivityFeed items={actividad.slice(0, 4)} /> : <p className="muted small">Sin actividad en esta sesión.</p>}
          </Panel>
          {esEspecialista && <Panel titulo="Canalizaciones recientes"><CasosCompactos casos={casos} /></Panel>}
        </div>
      </div>
      <div className="adm__row adm__row--top">
        <KpiCard titulo="Usuarias registradas" valor={String(totalUsuarias)} detalle="por ruta principal" lista={listaRutas} />
        <Panel titulo="Usuarias nuevas por semana (ejemplo)"><BarChart semanas={SEMANAS} series={SERIES} /></Panel>
        <MiniCalendar marcas={MARCAS_CALENDARIO} />
      </div>
    </>
  );

  const vistaUsuarias = () => !esAsesora ? <Navigate to="/admin" replace /> : fichaSel
    ? <UserFicha key={`${fichaSel.id}-${fichaSel.version}`} usuaria={fichaSel} onVolver={() => setSel(null)} onRegistrar={registrar} onContactar={abrirContacto} />
    : (
      <Panel titulo="Usuarias" accion={
        <div className="pnl__tools">
          <label className="search"><Icon name="buscar" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre" aria-label="Buscar usuaria" /></label>
          {btnExcel(exportarUsuarias)}
        </div>}>
        <div className="chips pnl__filtros" role="group" aria-label="Filtrar usuarias">
          <button type="button" className="chip" aria-pressed={filtroU === "todas"} onClick={() => setFiltroU("todas")}>Todas <span className="chip__n">{usuarias.length}</span></button>
          <button type="button" className="chip" aria-pressed={filtroU === "seguimiento"} onClick={() => setFiltroU("seguimiento")}>Para dar seguimiento <span className="chip__n">{pendientes.length}</span></button>
        </div>
        <UsersTable usuarias={filtradas} onOpen={verFicha} onContactar={abrirContacto} />
      </Panel>
    );

  const vistaOfertas = () => (
    <Panel titulo="Ofertas de trabajo" accion={
      <div className="pnl__tools">
        <label className="search"><Icon name="buscar" size={18} />
          <input value={qOf} onChange={(e) => setQOf(e.target.value)} placeholder="Buscar puesto o empresa" aria-label="Buscar oferta" /></label>
        {btnExcel(exportarOfertas)}
        {editaCatalogo && <Button size="sm" onClick={() => abrirEditor()}><Icon name="mas" size={18} /> Nueva oferta</Button>}
      </div>}>
      <div className="chips pnl__filtros" role="group" aria-label="Filtrar ofertas">
        {[["todas", "Todas", ofertas.length], ["publicadas", "Publicadas", publicadas], ["pausa", "En pausa", ofertas.length - publicadas]].map(([k, l, n]) => (
          <button key={k} type="button" className="chip" aria-pressed={filtroOf === k} onClick={() => setFiltroOf(k)}>{l} <span className="chip__n">{n}</span></button>
        ))}
      </div>
      <OfertasTable ofertas={ofertasFiltradas} onEditar={editaCatalogo ? abrirEditor : () => {}} onPublicar={editaCatalogo ? publicar : () => {}} />
      <p className="muted small pnl__nota">Las ofertas publicadas aparecen en «Tus recursos» de las usuarias con ruta de empleabilidad.</p>
    </Panel>
  );

  const bandeja = () => !esEspecialista ? <Navigate to="/admin" replace /> : (
    <Panel titulo="Bandeja de canalizaciones" accion={btnExcel(exportarCasos)}>
      <p className="muted small">Ordenadas por urgencia. Solo ves los casos de tu especialidad.</p>
      <CasosTable casos={casos} onCambiar={cambiarCaso} />
    </Panel>
  );
  const vistaCatalogo = () => (
    <Panel titulo="Catálogo de recursos" accion={<Button variant="ghost" size="sm" to="/admin/ofertas"><Icon name="maletin" size={18} /> Gestionar ofertas de trabajo</Button>}>
      <p className="muted small">{catalogo.length} recursos. Los vencidos dejan de mostrarse a las usuarias.</p>
      <CatalogTable recursos={catalogo} vencidos={vencidos} onToggle={toggleVencido} />
    </Panel>
  );
  const porEstado = metr?.canalizaciones_por_estado;
  const metricas = () => (
    <div className="adm__row adm__row--metrics">
      {porEstado && (
        <KpiCard titulo="Canalizaciones abiertas" valor={Object.entries(porEstado).filter(([k]) => k !== "cerrada").reduce((a, [, n]) => a + n, 0)}
          detalle={`${Object.values(porEstado).reduce((a, b) => a + b, 0)} en total`}
          lista={[{ label: "Nuevas", valor: porEstado.nueva || 0, color: "var(--coral-500)" },
                  { label: "En atención", valor: porEstado["en atención"] || 0, color: "var(--mostaza-500)" },
                  { label: "Cerradas", valor: porEstado.cerrada || 0, color: "var(--oliva-500)" }]} />
      )}
      <Panel titulo="Usuarias nuevas por semana (ejemplo)"><BarChart semanas={SEMANAS} series={SERIES} /></Panel>
      <Panel titulo="Acciones de usuarias">
        <ProgressList items={[
          { label: "Aplicaron", valor: acciones.aplicado || 0, color: "var(--turquesa-500)" },
          { label: "Guardaron", valor: acciones.guardado || 0, color: "var(--naranja-500)" },
        ]} />
      </Panel>
    </div>
  );

  const titulos = { usuarias: "Usuarias", ofertas: "Ofertas de trabajo", bandeja: "Canalizaciones", catalogo: "Catálogo", metricas: "Métricas" };
  secciones.forEach((x) => { titulos[x.ruta] = x.titulo; });
  const titulo = titulos[pathname.split("/")[2]] || (usaBase ? "Resumen" : secciones[0]?.titulo || "Panel");
  const ocultar = [!esAsesora && "/admin/usuarias", !esEspecialista && "/admin/bandeja"].filter(Boolean);
  const menu = [
    ...(usaBase ? MENU_BASE.filter((m) => !ocultar.includes(m.to)).map((m) => (
      m.to === "/admin/bandeja" ? { ...m, badge: abiertos }
        : m.to === "/admin/usuarias" ? { ...m, badge: pendientes.length, badgeSoft: true } : m)) : []),
    ...secciones.map((x) => ({ to: `/admin/${x.ruta}`, label: x.titulo, icon: x.icono })),
  ];
  return (
    <AdminTemplate titulo={titulo} menu={menu} casosAbiertos={usaBase ? abiertos : 0}
      persona={{ nombre: yo.nombre, rolTexto: ROL_TEXTO[yo.rol] }} onSalir={onSalir}>
      {aviso && (
        <p className="card card--sunken small" role="alert">
          {aviso} <Button variant="link" size="sm" onClick={() => setAviso("")}>Cerrar</Button>
        </p>
      )}
      <Routes>
        <Route index element={usaBase ? resumen()
          : secciones[0] ? <Navigate to={secciones[0].ruta} replace />
          : <p className="muted">Tu sección del panel todavía no está disponible.</p>} />
        {secciones.map(({ ruta, Componente }) => (
          <Route key={ruta} path={`${ruta}/*`} element={<Componente yo={yo} />} />
        ))}
        <Route path="usuarias" element={vistaUsuarias()} />
        <Route path="ofertas" element={vistaOfertas()} />
        <Route path="bandeja" element={bandeja()} />
        <Route path="catalogo" element={vistaCatalogo()} />
        <Route path="metricas" element={metricas()} />
      </Routes>

      <OfertaEditor key={`of-${editor.n}`} abierto={editor.abierto} oferta={editor.oferta}
        onCerrar={() => setEditor((e) => ({ ...e, abierto: false }))} onGuardar={guardar} />
      <ContactarDialog key={`ct-${contacto.n}`} usuaria={usuariaContacto} abierto={Boolean(usuariaContacto)}
        onCerrar={() => setContacto((c) => ({ ...c, id: null }))} onRegistrar={registrarContacto} />
    </AdminTemplate>
  );
}
