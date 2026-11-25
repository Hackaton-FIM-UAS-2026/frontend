import { motion } from "motion/react";

export function ChatBubble({ from = "agente", children }) {
  return (
    <motion.div
      className={`bubble bubble--${from}`}
      initial={{ opacity: 0, transform: "translateY(6px) scale(0.98)" }}
      animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: from === "usuaria" ? "bottom right" : "bottom left" }}
    >
      {children}
    </motion.div>
  );
}

export function TypingBubble() {
  return (
    <div className="bubble bubble--agente bubble--escribiendo" aria-label="El asistente está escribiendo">
      <i /><i /><i />
    </div>
  );
}
