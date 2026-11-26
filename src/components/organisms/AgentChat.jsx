import { useState } from "react";
import { Button } from "../atoms";
import { ChatBubble } from "../molecules";

/**
 * Chat del agente. La detección de señales (M12) real vive en el backend;
 * aquí solo se simula con palabras clave para que el flujo se pueda demostrar.
 * Claude solo clasifica y elige plantilla: NO redacta libremente en el flujo sensible.
 */
const SENALES = ["mi pareja", "ya no puedo más", "violencia", "me golpea", "miedo"];

export function AgentChat({ onProponerCanalizacion }) {
  const [msgs, setMsgs] = useState([
    { from: "agente", text: "Hola, ¿en qué te puedo ayudar con tus recomendaciones?" },
  ]);
  const [texto, setTexto] = useState("");
  const [propuesta, setPropuesta] = useState(false);

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim()) return;
    const hay = SENALES.some((s) => texto.toLowerCase().includes(s));
    setMsgs([...msgs, { from: "usuaria", text: texto },
      { from: "agente", text: hay
        ? "Gracias por contármelo. Hay personas que te pueden apoyar. ¿Quieres que te conecte con ellas? Tú decides."
        : "Gracias. Lo tomo en cuenta para tus recomendaciones." }]);
    setPropuesta(hay);
    setTexto("");
  };

  return (
    <div className="chat">
      <div className="chat__msgs" aria-live="polite">
        {msgs.map((m, i) => <ChatBubble key={i} from={m.from}>{m.text}</ChatBubble>)}
        {propuesta && (
          <div className="chat__propuesta">
            <Button onClick={onProponerCanalizacion}>Sí, quiero hablar con alguien</Button>
            <Button variant="ghost" onClick={() => setPropuesta(false)}>Ahora no</Button>
          </div>
        )}
      </div>
      <form className="chat__form" onSubmit={enviar}>
        <input className="input" value={texto} onChange={(e) => setTexto(e.target.value)} placeholder="Escribe aquí…" aria-label="Mensaje" />
        <Button type="submit">Enviar</Button>
      </form>
    </div>
  );
}
