import { useEffect, useRef } from "react";
import { Button, Icon } from "../atoms";
import { OptionButton } from "./QuizMolecules.jsx";

/** Tarjeta de una pregunta: pregunta, "por qué preguntamos" y opciones. */
export function QuestionCard({ numero, pregunta, porque, tipo, opciones, exclusiva, valor, onChange, onNext, onBack }) {
  const sel = tipo === "multiple" ? valor || [] : valor;
  const activa = (o) => (tipo === "multiple" ? sel.includes(o) : sel === o);
  const titulo = useRef(null);

  // Al cambiar de pregunta, el foco va al título (lectores de pantalla y teclado)
  useEffect(() => {
    if (numero > 1) titulo.current?.focus({ preventScroll: true });
  }, [numero]);

  const toggle = (o) => {
    if (tipo === "multiple") {
      if (activa(o)) onChange(sel.filter((x) => x !== o));
      // «Ninguna» excluye a las demás, y elegir otra quita «Ninguna»
      else if (exclusiva && o === exclusiva) onChange([o]);
      else onChange([...sel.filter((x) => x !== exclusiva), o]);
    }
    else { onChange(o); setTimeout(() => onNext?.(o), 220); }   // avanza solo, con un respiro visual
  };

  const muchas = opciones.length > 4;
  return (
    <div className="card qcard">
      <h2 ref={titulo} tabIndex={-1}>{pregunta}</h2>
      {porque && <p className="qcard__why"><Icon name="candado" size={16} /> {porque}</p>}
      {tipo === "multiple" && <p className="qcard__hint">Puedes elegir más de una.</p>}
      <div className={`opts qcard__opts ${muchas ? "opts--2" : ""}`} role={tipo === "multiple" ? "group" : "radiogroup"} aria-label={pregunta}>
        {opciones.map((o, n) => (
          <OptionButton key={o} index={n} label={o} active={activa(o)} onClick={() => toggle(o)}
            role={tipo === "multiple" ? "button" : "radio"} />
        ))}
      </div>
      <div className="qcard__nav">
        {onBack ? <Button variant="link" onClick={onBack}><Icon name="izq" size={18} /> Regresar</Button> : <span />}
        {tipo === "multiple" && <Button onClick={() => onNext?.(sel)} disabled={!sel.length}>Continuar <Icon name="der" size={18} /></Button>}
      </div>
    </div>
  );
}
