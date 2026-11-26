import { useMemo, useState } from "react";
import { Routes, Route, useNavigate, useLocation, Link } from "react-router-dom";
import { AdminTemplate } from "../components/templates";
import { Button, Icon } from "../components/atoms";
import {
  Panel, KpiCard, BarChart, MiniCalendar, UsersTable, CasosTable, CasosCompactos,
  ActivityFeed, UserFicha, CatalogTable, ProgressList,
  SeguimientoList, ContactarDialog, necesitaSeguimiento,
  OfertasTable, OfertaEditor, estadoOferta,
} from "../components/organisms";
import { USUARIAS, CASOS_INICIALES, SEMANAS, SERIES, ACTIVIDAD, MARCAS_CALENDARIO } from "../data/admin";
import { exportarCSV } from "../services/exportar";
import { leerCatalogo, guardarOferta, cambiarPublicacion } from "../services/catalogo";

const KPI_RUTAS = [
  { label: "Empleabilidad", valor: 64, color: "var(--turquesa-500)" },
  { label: "Emprendimiento", valor: 61, color: "var(--naranja-500)" },
  { label: "Capacitación", valor: 66, color: "var(--magenta-500)" },
];

export default function AdminPanel() {
  const nav = useNavigate();
  const { pathname } = useLocation();
  const [usuarias, setUsuarias] = useState(USUARIAS);
  const [casos, setCasos] = useState(CASOS_INICIALES);
  const [actividad, setActividad] = useState(ACTIVIDAD);
  const [catalogo, setCatalogo] = useState(leerCatalogo);
  const [vencidos, setVencidos] = useState([]);
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");
  const [filtroU, setFiltroU] = useState("todas");
  // Ofertas
  const [qOf, setQOf] = useState("");
  const [filtroOf, setFiltroOf] = useState("todas");
  const [editor, setEditor] = useState({ abierto: false, oferta: null, n: 0 });
  // Contacto
  const [contacto, setContacto] = useState({ id: null, n: 0 });

  const abiertos = casos.filter((c) => c.estado !== "cerrada").length;
  const pendientes = usuarias.filter(necesitaSeguimiento);
  const ofertas = catalogo.filter((r) => r.tipo === "vacante");
  const publicadas = ofertas.filter((o) => o.publicada !== false).length;

  const bitacora = (texto) => setActividad((a) => [{ quien: "Ana Torres", rol: "Asesora económica", texto, hora: "Ahora" }, ...a]);
  const cambiarCaso = (id, estado) => setCasos(casos.map((c) => (c.id === id ? { ...c, estado } : c)));
  const agregarHistorial = (id, entrada, extra = {}) =>
    setUsuarias((us) => us.map((u) => u.id !== id ? u : {
      ...u, ...extra, version: u.version + 1, ultima: "25 nov",
      historial: [{ fecha: "25 nov", fuente: "personal_cemujeres", ...entrada }, ...u.historial],
    }));
  const registrar = (id, estado, nota) =>
    agregarHistorial(id, { texto: `Asesora registró: ${estado.toLowerCase()}${nota ? ` — ${nota}` : ""}` }, { estado });

  const registrarContacto = (id, { medio, resultado, nota }) => {
    const u = usuarias.find((x) => x.id === id);
    agregarHistorial(id, { texto: `Contacto por ${medio.toLowerCase()}: ${resultado.toLowerCase()}${nota ? ` — ${nota}` : ""}` },
      u.estado === "Nueva" && resultado === "Contestó" ? { estado: "Inscrita" } : {});
    bitacora(`Contactó a ${u.nombre} por ${medio.toLowerCase()} (${resultado.toLowerCase()}).`);
    setContacto((c) => ({ ...c, id: null }));
  };
  const abrirContacto = (id) => setContacto((c) => ({ id, n: c.n + 1 }));

  const toggleVencido = (id) => setVencidos(vencidos.includes(id) ? vencidos.filter((x) => x !== id) : [...vencidos, id]);
  const abrirEditor = (oferta = null) => setEditor((e) => ({ abierto: true, oferta, n: e.n + 1 }));
  const guardar = (oferta) => {
    const g = guardarOferta(oferta);
    setCatalogo(leerCatalogo());
    setEditor((e) => ({ ...e, abierto: false }));
    bitacora(`${oferta.id ? "Editó" : "Publicó"} la oferta «${g.titulo}».`);
  };
  const publicar = (id, publicada) => {
    const o = cambiarPublicacion(id, publicada);
    setCatalogo(leerCatalogo());
    if (o) bitacora(`${publicada ? "Publicó" : "Pausó"} la oferta «${o.titulo}».`);
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
  const abrirFicha = (id) => { setSel(id); nav("/admin/usuarias"); };

  const pulso = [
    ["Para dar seguimiento", pendientes.length, "/admin/usuarias", "usuarias", () => setFiltroU("seguimiento")],
    ["Ofertas de trabajo publicadas", publicadas, "/admin/ofertas", "maletin"],
    ["Canalizaciones abiertas", abiertos, "/admin/bandeja", "bandeja"],
  ];

  // Vistas como funciones (no componentes) para que los campos no pierdan el foco al re-renderizar
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
        <Panel titulo="Para dar seguimiento" accion={<Button variant="link" size="sm" to="/admin/usuarias" onClick={() => setFiltroU("seguimiento")}>Ver todas</Button>}>
          <SeguimientoList usuarias={pendientes.slice(0, 5)} onAbrir={abrirFicha} onContactar={abrirContacto} />
        </Panel>
        <div className="adm__stack">
          <Panel titulo="Actividad reciente"><ActivityFeed items={actividad.slice(0, 4)} /></Panel>
          <Panel titulo="Canalizaciones recientes"><CasosCompactos casos={casos} /></Panel>
        </div>
      </div>
      <div className="adm__row adm__row--top">
        <KpiCard titulo="Usuarias registradas" valor="128" detalle="+18 esta semana"
          lista={[
            { label: "Empleabilidad", valor: 54, color: "var(--turquesa-500)" },
            { label: "Emprendimiento", valor: 41, color: "var(--naranja-500)" },
            { label: "Capacitación", valor: 33, color: "var(--magenta-500)" },
          ]} />
        <Panel titulo="Usuarias nuevas por semana"><BarChart semanas={SEMANAS} series={SERIES} /></Panel>
        <MiniCalendar marcas={MARCAS_CALENDARIO} />
      </div>
    </>
  );

  const vistaUsuarias = () => fichaSel
    ? <UserFicha key={fichaSel.id} usuaria={fichaSel} onVolver={() => setSel(null)} onRegistrar={registrar} onContactar={abrirContacto} />
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
        <UsersTable usuarias={filtradas} onOpen={setSel} onContactar={abrirContacto} />
      </Panel>
    );

  const vistaOfertas = () => (
    <Panel titulo="Ofertas de trabajo" accion={
      <div className="pnl__tools">
        <label className="search"><Icon name="buscar" size={18} />
          <input value={qOf} onChange={(e) => setQOf(e.target.value)} placeholder="Buscar puesto o empresa" aria-label="Buscar oferta" /></label>
        {btnExcel(exportarOfertas)}
        <Button size="sm" onClick={() => abrirEditor()}><Icon name="mas" size={18} /> Nueva oferta</Button>
      </div>}>
      <div className="chips pnl__filtros" role="group" aria-label="Filtrar ofertas">
        {[["todas", "Todas", ofertas.length], ["publicadas", "Publicadas", publicadas], ["pausa", "En pausa", ofertas.length - publicadas]].map(([k, l, n]) => (
          <button key={k} type="button" className="chip" aria-pressed={filtroOf === k} onClick={() => setFiltroOf(k)}>{l} <span className="chip__n">{n}</span></button>
        ))}
      </div>
      <OfertasTable ofertas={ofertasFiltradas} onEditar={abrirEditor} onPublicar={publicar} />
      <p className="muted small pnl__nota">Las ofertas publicadas aparecen en «Tus recursos» de las usuarias con ruta de empleabilidad. En la demo se guardan en este navegador.</p>
    </Panel>
  );

  const bandeja = () => (
    <Panel titulo="Bandeja de canalizaciones" accion={btnExcel(exportarCasos)}>
      <p className="muted small">Ordenadas por urgencia. Solo las ven los roles de especialista; aquí se muestra con datos ficticios.</p>
      <CasosTable casos={casos} onCambiar={cambiarCaso} />
    </Panel>
  );
  const vistaCatalogo = () => (
    <Panel titulo="Catálogo de recursos" accion={<Button variant="ghost" size="sm" to="/admin/ofertas"><Icon name="maletin" size={18} /> Gestionar ofertas de trabajo</Button>}>
      <p className="muted small">Ejemplo con {catalogo.length} recursos. Los vencidos dejan de mostrarse a las usuarias.</p>
      <CatalogTable recursos={catalogo} vencidos={vencidos} onToggle={toggleVencido} />
    </Panel>
  );
  const metricas = () => (
    <div className="adm__row adm__row--metrics">
      <KpiCard titulo="Canalizaciones abiertas" valor={abiertos} detalle={`${casos.length} en total`}
        lista={[{ label: "Nuevas", valor: casos.filter((c) => c.estado === "nueva").length, color: "var(--coral-500)" },
                { label: "En atención", valor: casos.filter((c) => c.estado === "en atención").length, color: "var(--mostaza-500)" },
                { label: "Cerradas", valor: casos.filter((c) => c.estado === "cerrada").length, color: "var(--oliva-500)" }]} />
      <Panel titulo="Usuarias nuevas por semana"><BarChart semanas={SEMANAS} series={SERIES} /></Panel>
      <Panel titulo="Usuarias que tomaron una acción"><ProgressList items={KPI_RUTAS} />
        <p className="muted small">Cifras de ejemplo. Métricas reales sugeridas: tiempo hasta la primera acción, % que aplica y canalizaciones atendidas.</p></Panel>
    </div>
  );

  const titulos = { usuarias: "Usuarias", ofertas: "Ofertas de trabajo", bandeja: "Canalizaciones", catalogo: "Catálogo", metricas: "Métricas" };
  const titulo = titulos[pathname.split("/")[2]] || "Resumen";
  return (
    <AdminTemplate titulo={titulo} casosAbiertos={abiertos} pendientes={pendientes.length}>
      <Routes>
        <Route index element={resumen()} />
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
