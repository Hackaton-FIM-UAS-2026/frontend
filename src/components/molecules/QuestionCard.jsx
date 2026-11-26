import { Button, Icon } from "../atoms";
import { OptionButton } from "./QuizMolecules.jsx";

/** Tarjeta de una pregunta: número, pregunta, "por qué preguntamos" y opciones en rejilla. */
export function QuestionCard({ numero, pregunta, porque, tipo, opciones, valor, onChange, onNext, onBack }) {
  const sel = tipo === "multiple" ? valor || [] : valor;
  const activa = (o) => (tipo === "multiple" ? sel.includes(o) : sel === o);

  const toggle = (o) => {
    if (tipo === "multiple") onChange(activa(o) ? sel.filter((x) => x !== o) : [...sel, o]);
    else { onChange(o); setTimeout(() => onNext?.(o), 220); }   // avanza solo, con un respiro visual
  };

  return (
    <div className="qcard">
      <span className="qcard__num">{String(numero).padStart(2, "0")}</span>
      <h2>{pregunta}</h2>
      {porque && <p className="qcard__why"><Icon name="candado" size={16} /> {porque}</p>}
      {tipo === "multiple" && <p className="qcard__hint">Puedes elegir más de una.</p>}
      <div className="qcard__opts" role={tipo === "multiple" ? "group" : "radiogroup"}>
        {opciones.map((o, n) => <OptionButton key={o} index={n} label={o} active={activa(o)} onClick={() => toggle(o)} />)}
      </div>
      <div className="qcard__nav">
        {onBack ? <button className="linkbtn" onClick={onBack}><Icon name="izq" size={18} /> Regresar</button> : <span />}
        {tipo === "multiple" && <Button onClick={() => onNext?.(sel)} disabled={!sel.length}>Continuar</Button>}
      </div>
    </div>
  );
}
