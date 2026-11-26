import { useState } from "react";
import { Button } from "../atoms";
import { RequirementItem } from "../molecules";
import { DICCIONARIO_PREGUNTAS } from "../../data/campos";

/** Detalle del recurso: lo que ya tienes / lo que te falta + preguntas del agente (1 a 3). */
export function ResourceDetail({ recurso, onAction }) {
  const [resp, setResp] = useState({});
  const faltantes = recurso.requisitos.filter((r) => r.ok === null && !(r.campo in resp));
  const preguntas = faltantes.slice(0, 3).map((r) => ({ campo: r.campo, ...DICCIONARIO_PREGUNTAS[r.campo] }));
  const reqs = recurso.requisitos.map((r) => ({ ...r, ok: r.ok ?? (resp[r.campo] ? resp[r.campo] !== "No" && resp[r.campo] !== "Nada" : null) }));
  const cumple = reqs.every((r) => r.ok === true);

  return (
    <div className="detail">
      <h1>{recurso.titulo}</h1>
      <p className="muted">{recurso.proveedor} · {recurso.ubicacion} · {recurso.costo}</p>
      <p className="muted small">Verificado en {recurso.verificado_el}</p>

      <h3>Lo que ya tienes y lo que te falta</h3>
      <ul className="reqlist">
        {reqs.map((r) => <RequirementItem key={r.campo} label={r.label} ok={r.ok === true} />)}
      </ul>

      {preguntas.length > 0 && (
        <div className="agentbox">
          <h3>Para saber si cumples, cuéntanos:</h3>
          {preguntas.map((p) => (
            <div key={p.campo} className="agentbox__q">
              <p><strong>{p.pregunta}</strong></p>
              <div className="agentbox__opts">
                {p.opciones.map((o) => (
                  <Button key={o} variant="ghost" onClick={() => setResp({ ...resp, [p.campo]: o })}>{o}</Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {cumple && <p className="cumples">¡Cumples!</p>}
      <div className="detail__actions">
        <Button block onClick={() => onAction("aplicar")}>Aplicar</Button>
        <Button block variant="ghost" onClick={() => onAction("guardar")}>Guardar para después</Button>
      </div>
    </div>
  );
}
