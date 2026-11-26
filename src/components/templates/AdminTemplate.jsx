import { useEffect, useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Icon, Avatar, Logo } from "../atoms";
import { SkipLink } from "./Templates.jsx";

/** Menú base del panel de SEMujeres. Los módulos agregan secciones (src/modulos/<m>/panel.jsx). */
export const MENU_BASE = [
  { to: "/admin", label: "Resumen", icon: "panel", end: true },
  { to: "/admin/usuarias", label: "Usuarias", icon: "usuarias" },
  { to: "/admin/ofertas", label: "Ofertas de trabajo", icon: "maletin" },
  { to: "/admin/bandeja", label: "Canalizaciones", icon: "bandeja" },
  { to: "/admin/catalogo", label: "Catálogo", icon: "libro" },
  { to: "/admin/metricas", label: "Métricas", icon: "grafica" },
];

const HOY = new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());

/**
 * Layout del panel (personal de SEMujeres y empresas).
 * `menu`: [{ to, label, icon, end?, badge?: number, badgeSoft?: boolean }]
 */
export function AdminTemplate({ titulo, menu = MENU_BASE, marca = "SEMujeres", casosAbiertos = 0, persona, onSalir, children }) {
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
          <Logo light /><span>{marca}</span>
          <button type="button" className="adm__close" onClick={() => setAbierto(false)} aria-label="Cerrar menú"><Icon name="x" size={22} /></button>
        </div>
        <div className="adm__profile">
          <Avatar nombre={persona?.nombre || "Personal"} size={44} />
          <span><strong>{persona?.nombre || "Personal"}</strong><small>{persona?.rolTexto || ""}</small></span>
        </div>
        <nav className="adm__nav" aria-label="Panel">
          {menu.map(({ to, label, icon, end, badge, badgeSoft }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setAbierto(false)}
              className={({ isActive }) => (isActive ? "adm__link adm__link--on" : "adm__link")}>
              <Icon name={icon} size={20} /> <span>{label}</span>
              {badge > 0 && <em className={`adm__badge ${badgeSoft ? "adm__badge--soft" : ""}`} aria-label={`${badge} pendientes`}>{badge}</em>}
            </NavLink>
          ))}
        </nav>
        {onSalir
          ? <button type="button" className="adm__link adm__out" onClick={onSalir}><Icon name="salir" size={20} /> <span>Cerrar sesión</span></button>
          : <Link to="/" className="adm__link adm__out"><Icon name="salir" size={20} /> <span>Volver al sitio</span></Link>}
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
            <small>Panel {marca} · {HOY}</small>
          </div>
          {casosAbiertos > 0 && (
            <Link to="/admin/bandeja" className="adm__bell" aria-label={`Canalizaciones abiertas: ${casosAbiertos}`}>
              <Icon name="campana" size={22} /><em>{casosAbiertos}</em>
            </Link>
          )}
        </header>
        <main id="contenido" className="adm__main">{children}</main>
      </div>
    </div>
  );
}
