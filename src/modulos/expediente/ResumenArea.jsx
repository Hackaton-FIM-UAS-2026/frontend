import { useNavigate } from "react-router-dom";
import { KpiCard, Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Button, Icon } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { get } from "../../services/api";
import { Urgencia, Vacio } from "./comun.jsx";
import "./estilos.css";

const AREA = { especialista_juridica: "Jurídico", especialista_psicologica: "Psicología", trabajo_social: "Trabajo Social" };
const ESTADOS = [["nueva", "Por asignar", "var(--warning)"], ["asignada", "Asignados", "var(--info)"], ["contactada", "Contactadas", "var(--morado-300)"],
  ["en atención", "En atención", "var(--success)"], ["cerrada", "Concluidos", "var(--tinta-500)"]];

function Cifra({ icono, valor, texto, tono }) {
  return (
    <div className={`card m4-cifra ${tono ? `m4-cifra--${tono}` : ""}`}>
      <span className="m4-cifra__ic"><Icon name={icono} size={20} /></span>
      <b>{valor}</b><span>{texto}</span>
    </div>
  );
}

/** Resumen del área: solo sus casos, sus urgencias y las visitas a su módulo. */
export default function ResumenArea({ yo }) {
  const nav = useNavigate();
  const { datos: r, cargando, error, recargar } = useApi(() => get("/panel/resumen"));
  if (!r) return <ApiEstado cargando={cargando} error={error} reintentar={recargar} />;
  const esTS = yo.rol === "trabajo_social";
  return (
    <div className="m4-col">
      <div className="m4-cifras">
        <Cifra icono="usuarias" valor={r.abiertos} texto={esTS ? "Casos abiertos" : "Mis casos abiertos"} />
        <Cifra icono="alerta" valor={r.urgentes} texto="Urgentes" tono={r.urgentes ? "urgente" : ""} />
        <Cifra icono="bandeja" valor={r.nuevos_semana} texto="Nuevos esta semana" />
        <Cifra icono="calendario" valor={r.visitas_hoy} texto={`Visitas hoy a ${AREA[yo.rol] || "tu módulo"}`} />
      </div>
      <div className="m4-cols">
        <Panel titulo={esTS ? "Casos que requieren atención" : "Tus pacientes"} accion={<Button size="sm" variant="link" onClick={() => nav("/admin/casos")}>Ver todos</Button>}>
          {r.recientes.length ? (
            <ul className="m4-lista">
              {r.recientes.map((c) => (
                <li key={c.folio}>
                  <button type="button" className="m4-persona" onClick={() => nav(`/admin/expedientes/${c.usuaria_id}`)}>
                    <span><strong>{c.nombre}</strong><small>{c.folio} · {c.estado} · hace {c.hace}</small></span>
                    <Urgencia valor={c.urgencia} />
                  </button>
                </li>
              ))}
            </ul>
          ) : <Vacio>No tienes casos abiertos.</Vacio>}
        </Panel>
        <KpiCard titulo={`Casos de ${AREA[yo.rol] || "tu área"}`} valor={Object.values(r.por_estado).reduce((a, b) => a + b, 0)}
          detalle={`${r.cerrados_mes} concluidos en los últimos 30 días`}
          lista={ESTADOS.filter(([k]) => !(yo.rol !== "trabajo_social" && k === "nueva")).map(([k, label, color]) => ({ label, valor: r.por_estado[k] || 0, color }))} />
      </div>
    </div>
  );
}
