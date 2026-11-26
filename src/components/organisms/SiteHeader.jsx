import { useState } from "react";
import { Link } from "react-router-dom";
import { Logo, Franja } from "../atoms";

const NAV = [
  ["/", "Inicio"],
  ["#como", "¿Cómo funciona?"],
  ["#rutas", "Rutas"],
  ["#recursos", "Recursos"],
  ["#apoyo", "Apoyo jurídico y psicológico"],
  ["/admin", "Panel CEMujeres"],
];

/** Ajuste de tamaño de texto (lectura fácil), como los botones Aa+ / Aa- del portal de referencia. */
function useTamanoTexto() {
  const [px, setPx] = useState(() => {
    try { return Number(localStorage.getItem("camino_px")) || 18; } catch { return 18; }
  });
  const cambiar = (delta) => {
    const nuevo = Math.min(24, Math.max(16, px + delta));
    setPx(nuevo);
    document.body.style.fontSize = `${nuevo}px`;
    try { localStorage.setItem("camino_px", String(nuevo)); } catch {}
  };
  return [px, cambiar];
}

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const [, cambiar] = useTamanoTexto();
  return (
    <header className="sitehead">
      <div className="topbar">
        <div className="topbar__in">
          <Link to="/" className="topbar__logo"><Logo light /></Link>
          <div className="topbar__right">
            <button className="aa" onClick={() => cambiar(-2)} aria-label="Reducir texto">Aa-</button>
            <button className="aa" onClick={() => cambiar(2)} aria-label="Aumentar texto">Aa+</button>
            <a href="#privacidad">Aviso de privacidad</a>
            <Link to="/registro" className="topbar__login">Iniciar sesión</Link>
            <button className="burger" onClick={() => setAbierto(!abierto)} aria-expanded={abierto} aria-label="Menú">☰</button>
          </div>
        </div>
      </div>
      <nav className={`mainnav ${abierto ? "mainnav--open" : ""}`} aria-label="Principal">
        <ul>
          {NAV.map(([to, label]) => (
            <li key={label}>
              {to.startsWith("#") ? <a href={to} onClick={() => setAbierto(false)}>{label}</a>
                : <Link to={to}>{label}</Link>}
            </li>
          ))}
        </ul>
      </nav>
      <Franja alto={6} />
    </header>
  );
}
