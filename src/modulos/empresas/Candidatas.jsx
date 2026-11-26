import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Panel } from "../../components/organisms";
import { ApiEstado } from "../../components/molecules";
import { Badge, Button, Input } from "../../components/atoms";
import { useApi } from "../../services/useApi";
import { candidatas, contratar, vacantes } from "./servicio.js";

/** Candidatas de una vacante: solo datos de trabajo (nombre, escolaridad, habilidades, experiencia, teléfono). */
export default function Candidatas() {
  const [params, setParams] = useSearchParams();
  const { datos: lista } = useApi(vacantes);
  const elegida = params.get("v") || lista?.find((v) => v.candidatas)?.id || lista?.[0]?.id || "";
  const { datos, cargando, error, recargar } = useApi(() => (elegida ? candidatas(elegida) : Promise.resolve([])), [elegida]);
  const [hechas, setHechas] = useState({});
  const marcar = async (uid) => {
    try { await contratar(elegida, uid); setHechas((h) => ({ ...h, [uid]: true })); } catch { /* se queda igual */ }
  };
  if (!lista) return <ApiEstado cargando />;
  if (!lista.length) return <p className="card card--sunken m6-muted">Cuando publiques vacantes, aquí verás a quienes apliquen.</p>;
  return (
    <div className="m6-pila">
      <Input as="select" label="Vacante" value={elegida} onChange={(e) => setParams({ v: e.target.value })} className="m6-select">
        {lista.map((v) => <option key={v.id} value={v.id}>{v.titulo} ({v.candidatas})</option>)}
      </Input>
      {!datos ? <ApiEstado cargando={cargando} error={error} reintentar={recargar} />
        : !datos.length ? <p className="card card--sunken m6-muted">Nadie ha aplicado todavía a esta vacante.</p>
        : (
          <Panel>
            <div className="tablewrap">
              <table className="dt dt--stack">
                <thead><tr><th>Nombre</th><th>Escolaridad</th><th>Habilidades</th><th>Experiencia</th><th>Teléfono</th><th /></tr></thead>
                <tbody>
                  {datos.map((c) => {
                    const contratada = c.estado === "contratada" || hechas[c.usuaria_id];
                    return (
                      <tr key={c.usuaria_id}>
                        <td className="dt__main"><strong>{c.nombre}</strong></td>
                        <td data-label="Escolaridad">{c.escolaridad}</td>
                        <td data-label="Habilidades">{c.habilidades || "—"}</td>
                        <td data-label="Experiencia">{c.experiencia}</td>
                        <td data-label="Teléfono"><a href={`tel:${c.telefono.replace(/\s/g, "")}`}>{c.telefono}</a></td>
                        <td className="dt__end">{contratada ? <Badge tone="success">Contratada</Badge>
                          : <Button size="sm" variant="quiet" onClick={() => marcar(c.usuaria_id)}>Marcar contratada</Button>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Panel>
        )}
    </div>
  );
}
