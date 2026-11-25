import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Icon, Avatar, Logo } from "../atoms";
import { SkipLink } from "./Templates.jsx";

const MENU = [
  ["/admin", "Resumen", "panel", true],
  ["/admin/usuarias", "Usuarias", "usuarias"],
  ["/admin/bandeja", "Canalizaciones", "bandeja"],
  ["/admin/catalogo", "Catálogo", "libro"],
  ["/admin/metricas", "Métricas", "grafica"],
];

export function AdminTemplate({ titulo, casosAbiertos = 0, children }) {
  const [abierto, setAbierto] = useState(false);

  useEffect(() => {
    if (!abierto) return;
    const esc = (e) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto]);

  return (
    <div className="adm">
      <SkipLink />
      <aside className={`adm__side ${abierto ? "adm__side--open" : ""}`} aria-label="Menú del panel">
        <div className="adm__brand">
          <Logo light /><span>CEMujeres</span>
          <button type="button" className="adm__close" onClick={() => setAbierto(false)} aria-label="Cerrar menú"><Icon name="x" size={22} /></button>
        </div>
        <div className="adm__profile">
          <Avatar nombre="Ana Torres" size={44} />
          <span><strong>Ana Torres</strong><small>Asesora económica · demo</small></span>
        </div>
        <nav className="adm__nav" aria-label="Panel">
          {MENU.map(([to, label, icon, end]) => (
            <NavLink key={to} to={to} end={end} onClick={() => setAbierto(false)}
              className={({ isActive }) => (isActive ? "adm__link adm__link--on" : "adm__link")}>
              <Icon name={icon} size={20} /> <span>{label}</span>
              {label === "Canalizaciones" && casosAbiertos > 0 && <em className="adm__badge">{casosAbiertos}</em>}
            </NavLink>
          ))}
        </nav>
        <Link to="/" className="adm__link adm__out"><Icon name="salir" size={20} /> <span>Volver al sitio</span></Link>
      </aside>
      <AnimatePresence>
        {abierto && (
          <motion.div className="adm__scrim" onClick={() => setAbierto(false)}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
        )}
      </AnimatePresence>

      <div className="adm__body">
        <header className="adm__top">
          <button type="button" className="adm__burger" onClick={() => setAbierto(true)} aria-label="Abrir menú" aria-expanded={abierto}>
            <Icon name="menu" size={24} />
          </button>
          <div className="adm__titles">
            <h1>{titulo}</h1>
            <small>Panel CEMujeres · miércoles 25 de noviembre de 2026</small>
          </div>
          <Link to="/admin/bandeja" className="adm__bell" aria-label={`Canalizaciones abiertas: ${casosAbiertos}`}>
            <Icon name="campana" size={22} />{casosAbiertos > 0 && <em>{casosAbiertos}</em>}
          </Link>
        </header>
        <main id="contenido" className="adm__main">{children}</main>
      </div>
    </div>
  );
}
