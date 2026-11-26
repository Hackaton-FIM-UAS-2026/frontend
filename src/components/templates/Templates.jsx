import { useLocation, Link } from "react-router-dom";
import { motion } from "motion/react";
import { AppHeader, BottomNav } from "../organisms";
import { Logo } from "../atoms";
import { useRequiereSesion } from "../../services/useSesion";

const ENTRA = {
  initial: { opacity: 0, transform: "translateY(8px)" },
  animate: { opacity: 1, transform: "translateY(0px)" },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

export function SkipLink() {
  return <a className="skip-link" href="#contenido">Saltar al contenido</a>;
}

/** App de la usuaria: barra superior, contenido y navegación inferior (móvil). */
/** `publica`: pantallas que se pueden ver sin sesión (p. ej. Explorar). */
export function AppTemplate({ children, wide, publica }) {
  const { pathname } = useLocation();
  const lista = useRequiereSesion(!publica);
  if (!lista) return null;
  return (
    <div className="app">
      <SkipLink />
      <AppHeader />
      <motion.main id="contenido" key={pathname} className={`app__main container ${wide ? "" : "container--narrow"}`} {...ENTRA}>
        {children}
      </motion.main>
      <BottomNav />
    </div>
  );
}

/** Registro / acceso: una tarjeta centrada sobre el fondo crema. */
export function AuthTemplate({ children }) {
  return (
    <div className="auth">
      <SkipLink />
      <header className="auth__head container"><Link to="/" aria-label="Empoderate, inicio"><Logo /></Link></header>
      <motion.main id="contenido" className="auth__main" {...ENTRA}>
        <div className="card auth__card">{children}</div>
      </motion.main>
    </div>
  );
}

/** Pantalla de foco (flujo sensible): sin navegación, solo la tarea. */
export function FocusTemplate({ children }) {
  return (
    <div className="focus">
      <SkipLink />
      <header className="focus__head container container--narrow"><Logo /></header>
      <motion.main id="contenido" className="focus__main container container--narrow" {...ENTRA}>{children}</motion.main>
    </div>
  );
}
