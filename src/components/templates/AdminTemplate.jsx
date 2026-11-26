import { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { Icon, Avatar, Logo } from "../atoms";

const MENU = [
  ["/admin", "Resumen", "panel", true],
  ["/admin/usuarias", "Usuarias", "usuarias"],
  ["/admin/bandeja", "Canalizaciones", "bandeja"],
  ["/admin/catalogo", "Catálogo", "libro"],
  ["/admin/metricas", "Métricas", "grafica"],
];

export function AdminTemplate({ titulo, casosAbiertos = 0, children }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="adm">
      <aside className={`adm__side ${abierto ? "adm__side--open" : ""}`}>
        <div className="adm__brand"><Logo light /><span>CEMujeres</span></div>
        <div className="adm__profile">
          <Avatar nombre="Ana Torres" size={72} />
          <strong>Ana Torres</strong>
          <small>Asesora económica · demo</small>
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
      {abierto && <div className="adm__scrim" onClick={() => setAbierto(false)} />}

      <div className="adm__body">
        <header className="adm__top">
          <button className="adm__burger" onClick={() => setAbierto(true)} aria-label="Abrir menú"><Icon name="menu" /></button>
          <div>
            <h1>{titulo}</h1>
            <small>Panel CEMujeres · miércoles 25 de noviembre de 2026</small>
          </div>
          <Link to="/admin/bandeja" className="adm__bell" aria-label="Canalizaciones nuevas">
            <Icon name="campana" size={22} />{casosAbiertos > 0 && <em>{casosAbiertos}</em>}
          </Link>
        </header>
        <main className="adm__main">{children}</main>
      </div>
    </div>
  );
}
