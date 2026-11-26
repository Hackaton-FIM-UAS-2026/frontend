import { useState } from "react";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Button, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { decidirEmpresa, decidirVacante, pendientes } from "./servicio.js";
import { Estado } from "./comun.jsx";
import "./estilos.css";

function Tarjeta({ titulo, filas, alerta, onDecidir }) {
  const [motivo, setMotivo] = useState("");
  const [error, setError] = useState("");
  const [ocupado, setOcupado] = useState("");
  const decidir = async (d) => {
    setError("");
    if (d === "rechazar" && !motivo.trim()) return setError("Escribe el motivo para que la empresa sepa qué corregir.");
    setOcupado(d);
    try { await onDecidir(d, motivo.trim()); } catch (e) { setError(e.message); setOcupado(""); }
  };
  return (
    <Panel className="m6-rev">
      <Estado valor="pendiente" />
      <h3 className="m6-rev__t">{titulo}</h3>
      <dl className="m6-datos">{filas.filter(([, v]) => v).map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
      {alerta && <p className="m6-alerta"><b>La IA notó:</b> {alerta}. Revisa con cuidado.</p>}
      <Input label="Motivo (si no se aprueba)" value={motivo} onChange={(e) => setMotivo(e.target.value)} error={error || undefined} />
      <div className="m6-fila">
        {/* Con alerta, «No aprobar» es la acción principal */}
        <Button variant={alerta ? "ghost" : "primary"} loading={ocupado === "aprobar"} onClick={() => decidir("aprobar")}>Aprobar y publicar</Button>
        <Button variant={alerta ? "secondary" : "link"} loading={ocupado === "rechazar"} onClick={() => decidir("rechazar")}>No aprobar</Button>
      </div>
    </Panel>
  );
}

/** Empoderamiento económico revisa cada empresa y cada vacante. La IA ayuda; decide una persona. */
export default function Revision() {
  const [vista, setVista] = useState("vacantes");
  const { datos, cargando, error, recargar } = useApi(pendientes);
  if (!datos) return <ApiEstado cargando={cargando} error={error} reintentar={recargar} />;
  const lista = vista === "vacantes" ? datos.vacantes : datos.empresas;
  return (
    <div className="m6-pila">
      <div className="m6-chips" role="tablist" aria-label="Qué revisar">
        {[["vacantes", `Vacantes (${datos.vacantes.length})`], ["empresas", `Empresas (${datos.empresas.length})`]].map(([v, t]) => (
          <button key={v} type="button" role="tab" aria-selected={vista === v} className={`m6-chip ${vista === v ? "m6-chip--on" : ""}`}
            onClick={() => setVista(v)}>{t}</button>
        ))}
      </div>
      {!lista.length ? <p className="card card--sunken m6-muted">No hay nada pendiente por revisar.</p> : (
        <div className="m6-rejilla">
          {vista === "vacantes" ? lista.map((v) => (
            <Tarjeta key={v.id} titulo={`${v.titulo} · ${v.empresa}`} alerta={v.alerta_ia}
              filas={[["Sueldo", v.sueldo], ["Lugar", v.ubicacion], ["Horario", v.horario], ["Descripción", v.descripcion],
                ["Empresa", v.empresa_estado === "aprobada" ? "Aprobada" : "Todavía en revisión"]]}
              onDecidir={async (d, m) => { await decidirVacante(v.id, d, m); recargar(); }} />
          )) : lista.map((e) => (
            <Tarjeta key={e.id} titulo={e.nombre}
              filas={[["RFC", e.rfc], ["Giro", e.giro], ["Contacto", e.contacto_nombre], ["Teléfono", e.telefono], ["Correo", e.correo]]}
              onDecidir={async (d, m) => { await decidirEmpresa(e.id, d, m); recargar(); }} />
          ))}
        </div>
      )}
    </div>
  );
}
