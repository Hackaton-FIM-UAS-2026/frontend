import { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { AdminTemplate } from "../components/templates";
import { Button, Icon } from "../components/atoms";
import {
  Panel, KpiCard, BarChart, MiniCalendar, UsersTable, CasosTable, CasosCompactos,
  ActivityFeed, UserFicha, CatalogTable, ProgressList,
} from "../components/organisms";
import { USUARIAS, CASOS_INICIALES, SEMANAS, SERIES, ACTIVIDAD, MARCAS_CALENDARIO } from "../data/admin";
import { RECURSOS } from "../data/recursos";
import { exportarCSV } from "../services/exportar";

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
  const [vencidos, setVencidos] = useState([]);
  const [sel, setSel] = useState(null);
  const [q, setQ] = useState("");

  const abiertos = casos.filter((c) => c.estado !== "cerrada").length;
  const cambiarCaso = (id, estado) => setCasos(casos.map((c) => (c.id === id ? { ...c, estado } : c)));
  const registrar = (id, estado, nota) =>
    setUsuarias(usuarias.map((u) => u.id !== id ? u : {
      ...u, estado, version: u.version + 1, ultima: "25 nov",
      historial: [{ fecha: "25 nov", texto: `Asesora registró: ${estado.toLowerCase()}${nota ? ` — ${nota}` : ""}`, fuente: "personal_cemujeres" }, ...u.historial],
    }));
  const toggleVencido = (id) => setVencidos(vencidos.includes(id) ? vencidos.filter((x) => x !== id) : [...vencidos, id]);

  const exportarUsuarias = () => exportarCSV("usuarias_camino",
    ["Nombre", "Ruta", "Estado", "Municipio", "Última actividad"],
    usuarias.map((u) => [u.nombre, u.ruta, u.estado, u.municipio, u.ultima]));
  const exportarCasos = () => exportarCSV("canalizaciones_camino",
    ["Caso", "Urgencia", "Tipo", "Medio", "Horario", "Estado", "Fecha"],
    casos.map((c) => [c.id, c.urgencia, c.tipo, c.medio, c.horario, c.estado, c.fecha]));
  const btnExcel = (onClick) => <Button variant="ghost" onClick={onClick}><Icon name="descargar" size={18} /> Exportar a Excel</Button>;

  const filtradas = usuarias.filter((u) => u.nombre.toLowerCase().includes(q.toLowerCase()));
  const fichaSel = usuarias.find((u) => u.id === sel);

  // Vistas como funciones (no componentes) para que los campos no pierdan el foco al re-renderizar
  const resumen = () => (
    <>
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
      <div className="adm__row adm__row--bottom">
        <Panel titulo="Usuarias recientes"><UsersTable usuarias={usuarias.slice(0, 4)} onOpen={(id) => { setSel(id); nav("/admin/usuarias"); }} compact /></Panel>
        <Panel titulo="Canalizaciones recientes"><CasosCompactos casos={casos} /></Panel>
        <Panel titulo="Actividad reciente"><ActivityFeed items={ACTIVIDAD} /></Panel>
      </div>
    </>
  );

  const vistaUsuarias = () => fichaSel
    ? <UserFicha usuaria={fichaSel} onVolver={() => setSel(null)} onRegistrar={registrar} />
    : (
      <Panel titulo="Usuarias" accion={
        <div className="pnl__tools">
          <label className="search"><Icon name="buscar" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por nombre" aria-label="Buscar usuaria" /></label>
          {btnExcel(exportarUsuarias)}
        </div>}>
        <UsersTable usuarias={filtradas} onOpen={setSel} />
      </Panel>
    );

  const bandeja = () => (
    <Panel titulo="Bandeja de canalizaciones" accion={btnExcel(exportarCasos)}>
      <p className="muted small">Ordenadas por urgencia. Solo las ven los roles de especialista; aquí se muestra con datos ficticios.</p>
      <CasosTable casos={casos} onCambiar={cambiarCaso} />
    </Panel>
  );

  const catalogo = () => (
    <Panel titulo="Catálogo de recursos">
      <p className="muted small">Ejemplo con {RECURSOS.length} recursos. Los vencidos dejan de mostrarse a las usuarias.</p>
      <CatalogTable recursos={RECURSOS} vencidos={vencidos} onToggle={toggleVencido} />
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

  const titulos = { usuarias: "Usuarias", bandeja: "Canalizaciones", catalogo: "Catálogo", metricas: "Métricas" };
  const titulo = titulos[pathname.split("/")[2]] || "Resumen";
  return (
    <AdminTemplate titulo={titulo} casosAbiertos={abiertos}>
      <Routes>
        <Route index element={resumen()} />
        <Route path="usuarias" element={vistaUsuarias()} />
        <Route path="bandeja" element={bandeja()} />
        <Route path="catalogo" element={catalogo()} />
        <Route path="metricas" element={metricas()} />
      </Routes>
    </AdminTemplate>
  );
}
