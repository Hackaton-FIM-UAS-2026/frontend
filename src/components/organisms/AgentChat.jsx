import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button, Icon } from "../atoms";
import { ChatBubble, TypingBubble, EmergencyBanner } from "../molecules";
import { api } from "../../services/api";

/**
 * Chat del agente. La detección de señales (M12) vive en el backend (POST /chat):
 * Claude solo clasifica y elige plantilla; NO redacta libremente en el flujo sensible.
 * La conversación no se guarda en ningún lado.
 */
export function AgentChat({ onProponerCanalizacion, onSinSesion }) {
  const [msgs, setMsgs] = useState([
    { from: "agente", text: "Hola, ¿en qué te puedo ayudar con tus recomendaciones?" },
  ]);
  const [texto, setTexto] = useState("");
  const [propuesta, setPropuesta] = useState(false);
  const [emergencia, setEmergencia] = useState(null);
  const [escribiendo, setEscribiendo] = useState(false);
  const fin = useRef(null);
  const reducir = useReducedMotion();

  useEffect(() => {
    fin.current?.scrollIntoView({ behavior: reducir ? "auto" : "smooth", block: "end" });
  }, [msgs, escribiendo, propuesta, reducir]);

  const enviar = async (e) => {
    e.preventDefault();
    const mensaje = texto.trim();
    if (!mensaje || escribiendo) return;
    setMsgs((m) => [...m, { from: "usuaria", text: mensaje }]);
    setTexto("");
    setPropuesta(false);
    setEscribiendo(true);
    try {
      const r = await api.chat(mensaje);
      setMsgs((m) => [...m, { from: "agente", text: r.respuesta }]);
      setPropuesta(Boolean(r.proponer_canalizacion));
      setEmergencia(r.emergencia || null);
    } catch (err) {
      if (err.status === 401) return onSinSesion?.();
      setMsgs((m) => [...m, { from: "agente", text: err.message || "La conexión está lenta. Intenta de nuevo." }]);
    } finally {
      setEscribiendo(false);
    }
  };

  return (
    <div className="chat">
      {emergencia && <EmergencyBanner telefonoJuridico={emergencia.secretaria_mujeres_sinaloa?.telefono || undefined} />}
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
