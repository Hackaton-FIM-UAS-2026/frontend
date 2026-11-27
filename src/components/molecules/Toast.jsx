import { useEffect } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Icon } from "../atoms";

/** Aviso breve abajo de la pantalla ("Curso agregado"). Se cierra solo a los 3 s. */
export function Toast({ mensaje, onCerrar }) {
  const quieto = useReducedMotion();
  useEffect(() => {
    if (!mensaje) return;
    const t = setTimeout(onCerrar, 3000);
    return () => clearTimeout(t);
  }, [mensaje, onCerrar]);

  return (
    <div className="toast-zona" role="status" aria-live="polite">
      <AnimatePresence>
        {mensaje && (
          <motion.p key={mensaje} className="toast"
            initial={quieto ? { opacity: 0 } : { opacity: 0, transform: "translateY(12px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transition: { duration: 0.14 } }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}>
            <Icon name="check" size={18} strokeWidth="2.6" /> {mensaje}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
