import { NavLink, Link } from "react-router-dom";
import { motion } from "motion/react";
import { Logo, Icon } from "../atoms";
import { MenuCuenta } from "../molecules";
import { destino } from "../../modulos/registro";

// Se calcula al renderizar (no al cargar el archivo): registro.js importa este módulo de forma circular.
const items = () => [
  [destino("/inicio", "/dashboard"), "Inicio", "casa"],
  [destino("/explorar", "/dashboard"), "Explorar", "buscar"],
  ["/seguimiento", "Mi avance", "avance"],
];

/** Barra superior de la app. En escritorio lleva las pestañas; siempre, el menú de cuenta. */
export function AppHeader() {
  return (
    <header className="appbar">
      <div className="appbar__in container">
        <Link to={destino("/inicio", "/dashboard")} className="appbar__logo" aria-label="Empoderate, mi inicio"><Logo /></Link>
        <nav className="appbar__tabs" aria-label="Principal">
          {items().map(([to, label, icon]) => (
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
        <div className="appbar__fin"><MenuCuenta /></div>
      </div>
    </header>
  );
}

/** Navegación inferior para el pulgar (solo móvil y tablet). */
export function BottomNav() {
  return (
    <nav className="bottomnav" aria-label="Principal">
      {items().map(([to, label, icon]) => (
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
