import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, Icon } from "../atoms";
import { ChatBubble, TypingBubble } from "../molecules";

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
  const [escribiendo, setEscribiendo] = useState(false);
  const fin = useRef(null);
  const reducir = useReducedMotion();

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "end" });
  }, [msgs, escribiendo, propuesta, reducir]);

  const enviar = (e) => {
    e.preventDefault();
    if (!texto.trim() || escribiendo) return;
    const hay = SENALES.some((s) => texto.toLowerCase().includes(s));
    const respuesta = hay
      ? "Gracias por contármelo. Hay personas que te pueden apoyar. ¿Quieres que te conecte con ellas? Tú decides."
      : "Gracias. Lo tomo en cuenta para tus recomendaciones.";
    setMsgs((m) => [...m, { from: "usuaria", text: texto }]);
    setTexto("");
    setPropuesta(false);
    // Pausa breve y solo visual antes de la respuesta (no cambia la lógica de señales)
    setEscribiendo(true);
    setTimeout(() => {
      setEscribiendo(false);
      setMsgs((m) => [...m, { from: "agente", text: respuesta }]);
      setPropuesta(hay);
    }, reducir ? 0 : 600);
  };

  return (
    <div className="chat">
      <div className="chat__msgs" aria-live="polite">
        {msgs.map((m, i) => <ChatBubble key={i} from={m.from}>{m.text}</ChatBubble>)}
        {escribiendo && <TypingBubble />}
        <AnimatePresence>
          {propuesta && (
            <motion.div className="card chat__propuesta"
              initial={{ opacity: 0, transform: "translateY(6px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transition: { duration: 0.14 } }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}>
              <Button block onClick={onProponerCanalizacion}>Sí, quiero hablar con alguien</Button>
              <Button block variant="ghost" onClick={() => setPropuesta(false)}>Ahora no</Button>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={fin} />
      </div>
      <form className="chat__form" onSubmit={enviar}>
        <label htmlFor="chat-msg" className="visually-hidden">Mensaje</label>
        <input id="chat-msg" className="input" value={texto} onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe aquí…" autoComplete="off" />
        <button type="submit" className="chat__send" aria-label="Enviar" disabled={!texto.trim() || escribiendo}>
          <Icon name="enviar" size={20} />
        </button>
      </form>
    </div>
  );
}
