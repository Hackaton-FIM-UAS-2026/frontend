import { NavLink, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Logo, Icon } from "../atoms";

const ITEMS = [
  ["/dashboard", "Recursos", "libro"],
  ["/seguimiento", "Mi avance", "avance"],
  ["/chat", "Asistente", "chat"],
];

/** Barra superior de la app. En escritorio lleva las pestañas; en móvil, solo marca y apoyo. */
export function AppHeader() {
  return (
    <header className="appbar">
      <div className="appbar__in container">
        <Link to="/" className="appbar__logo" aria-label="Empoderate, inicio"><Logo /></Link>
        <nav className="appbar__tabs" aria-label="Principal">
          {ITEMS.map(([to, label, icon]) => (
            <NavLink key={to} to={to} className={({ isActive }) => `tab ${isActive ? "tab--on" : ""}`}>
              {({ isActive }) => (
                <>
                  {isActive && <motion.span layoutId="tab-pill" className="tab__pill" transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />}
                  <Icon name={icon} size={18} /><span>{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <Link to="/apoyo" className="appbar__apoyo">Necesito apoyo</Link>
      </div>
    </header>
  );
}

/** Navegación inferior para el pulgar (solo móvil y tablet). */
export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Principal">
      {ITEMS.map(([to, label, icon]) => (
        <NavLink key={to} to={to} className={({ isActive }) => `bn ${isActive ? "bn--on" : ""}`}>
          {({ isActive }) => (
            <>
              <span className="bn__icon">
                {isActive && <motion.span layoutId="bn-pill" className="bn__pill" transition={{ type: "spring", duration: 0.35, bounce: 0.15 }} />}
                <Icon name={icon} size={22} />
              </span>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
