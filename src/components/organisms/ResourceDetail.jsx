import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Button, Icon, Badge } from "../atoms";
import { RequirementItem, PageHeader, OptionButton } from "../molecules";
import { DICCIONARIO_PREGUNTAS } from "../../data/campos";
// Tipo visible (sin palabras internas como «empleabilidad»)
const TIPO = { vacante: "Vacante", curso: "Curso", beca: "Beca", apoyo: "Apoyo", financiamiento: "Apoyo para tu negocio" };
const TONO_TIPO = { vacante: "empleabilidad", curso: "capacitacion", beca: "emprendimiento", apoyo: "emprendimiento", financiamiento: "emprendimiento" };

const aparece = {
  initial: { opacity: 0, transform: "translateY(6px)" },
  animate: { opacity: 1, transform: "translateY(0px)" },
  exit: { opacity: 0, transition: { duration: 0.14 } },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

/**
 * Detalle del recurso: lo que ya tienes / lo que te falta + preguntas del agente (1 a 3).
 * Con backend: `recurso.preguntas`, `recurso.cumple` y `requisitos[].ok` ya vienen evaluados;
 * al contestar se llama `onResponder(campo, valor)` y la página vuelve a pedir el recurso.
 */
export function ResourceDetail({ recurso, enviando, onAction, onResponder }) {
  const [resp, setResp] = useState({});
  const conApi = Array.isArray(recurso.preguntas);
  const preguntas = conApi
    ? recurso.preguntas
    : recurso.requisitos.filter((r) => r.ok === null && !(r.campo in resp) && DICCIONARIO_PREGUNTAS[r.campo])
        .slice(0, 3).map((r) => ({ campo: r.campo, ...DICCIONARIO_PREGUNTAS[r.campo] }));
  const reqs = conApi ? recurso.requisitos
    : recurso.requisitos.map((r) => ({ ...r, ok: r.ok ?? (resp[r.campo] ? resp[r.campo] !== "No" && resp[r.campo] !== "Nada" : null) }));
  const cumple = conApi ? recurso.cumple === true : reqs.every((r) => r.ok === true);
  const listos = reqs.filter((r) => r.ok === true).length;
  // Estado guardado por el backend: "aplicado" o más (inscrita, contratada…) ya no se vuelve a aplicar
  const aplicado = Boolean(recurso.mi_estado) && recurso.mi_estado !== "guardado";
  const guardado = recurso.mi_estado === "guardado";
  const responder = (campo, valor) => {
    setResp({ ...resp, [campo]: valor });
    onResponder?.(campo, valor);
  };

  return (
    <div className="detail">
      <div className="detail__rutas">
        <Badge tone={TONO_TIPO[recurso.tipo] || "primary"}>{TIPO[recurso.tipo] || "Opción"}</Badge>
      </div>
      <PageHeader
        title={recurso.titulo}
        lead={recurso.proveedor}
        meta={<>
          <span><Icon name="ubicacion" size={16} /> {recurso.ubicacion}</span>
          <span><Icon name="moneda" size={16} /> {recurso.costo}</span>
          <span><Icon name="escudo" size={16} /> Verificado en {recurso.verificado_el}</span>
        </>}
      />

      {recurso.explicacion && <p className="detail__porque">{recurso.explicacion}</p>}

      <section className="card detail__reqs" aria-labelledby="req-titulo">
        <div className="detail__reqhead">
          <h2 id="req-titulo" className="card__title">Lo que ya tienes y lo que te falta</h2>
          <span className="detail__count">{listos} de {reqs.length}</span>
        </div>
        <ul className="reqlist">
          {reqs.map((r) => <RequirementItem key={r.campo} label={r.label} ok={r.ok === true} />)}
        </ul>
      </section>

      <AnimatePresence initial={false}>
        {preguntas.length > 0 && (
          <motion.section key="agentbox" className="card card--sunken agentbox" aria-labelledby="agent-titulo" {...aparece}>
            <h2 id="agent-titulo" className="card__title">Para saber si cumples, cuéntanos:</h2>
            <AnimatePresence initial={false} mode="popLayout">
              {preguntas.map((p) => (
                <motion.div key={p.campo} className="agentbox__q" {...aparece}>
                  <p className="agentbox__pregunta">{p.pregunta}</p>
                  <div className="agentbox__opts">
                    {p.opciones.map((o) => (
                      <OptionButton key={o} compact label={o} active={resp[p.campo] === o}
                        onClick={() => responder(p.campo, o)} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.section>
        )}
        {cumple && (
          <motion.p key="cumples" className="cumples" role="status" {...aparece}>
            <span className="cumples__icon"><Icon name="check" size={20} strokeWidth="2.6" /></span>
            ¡Cumples! Ya puedes aplicar.
          </motion.p>
        )}
      </AnimatePresence>

      <div className="detail__actions">
        {aplicado
          ? <Button block disabled>{recurso.tipo === "vacante" ? "Ya aplicaste" : "Ya está en tu avance"} <Icon name="check" size={18} /></Button>
          : <Button block onClick={() => onAction("aplicar")} disabled={enviando}>Aplicar <Icon name="flecha" size={18} /></Button>}
        {!aplicado && (guardado
          ? <Button block variant="ghost" disabled>Guardado <Icon name="check" size={18} /></Button>
          : <Button block variant="ghost" onClick={() => onAction("guardar")} disabled={enviando}>Guardar para después</Button>)}
      </div>
    </div>
  );
}
