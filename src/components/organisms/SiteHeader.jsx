import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Logo, Icon, Button } from "../atoms";

const NAV = [
  ["#como", "¿Cómo funciona?"],
  ["#rutas", "Rutas"],
  ["#recursos", "Recursos"],
  ["#apoyo", "Apoyo jurídico y psicológico"],
];

/** Ajuste de tamaño de texto (lectura fácil), como los botones Aa+ / Aa- del portal de referencia. */
function useTamanoTexto() {
  const [px, setPx] = useState(() => {
    try { return Number(localStorage.getItem("camino_px")) || null; } catch { return null; }
  });
  useEffect(() => {
    if (px) document.documentElement.style.fontSize = `${px}px`;
  }, [px]);
  const cambiar = (delta) => {
    const base = px || parseFloat(getComputedStyle(document.documentElement).fontSize) || 18;
    const nuevo = Math.min(24, Math.max(16, base + delta));
    setPx(nuevo);
    try { localStorage.setItem("camino_px", String(nuevo)); } catch {}
  };
  return [px, cambiar];
}

function useConScroll() {
  const [s, setS] = useState(false);
  useEffect(() => {
    const on = () => setS(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return s;
}

export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const [, cambiar] = useTamanoTexto();
  const conScroll = useConScroll();

  useEffect(() => {
    if (!abierto) return;
    const esc = (e) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto]);

  return (
    <header className={`sitehead ${conScroll ? "sitehead--scrolled" : ""}`}>
      <div className="sitehead__in container">
        <Link to="/" className="sitehead__logo" aria-label="Camino, inicio"><Logo /></Link>

        <nav className="sitenav" aria-label="Principal">
          <ul>{NAV.map(([to, label]) => <li key={to}><a href={to}>{label}</a></li>)}</ul>
        </nav>

        <div className="sitehead__tools">
          <div className="textsize" role="group" aria-label="Tamaño del texto">
            <button type="button" onClick={() => cambiar(-1)} aria-label="Reducir texto">A−</button>
            <button type="button" onClick={() => cambiar(1)} aria-label="Aumentar texto">A+</button>
          </div>
          <Button to="/registro" size="sm" className="sitehead__login">Iniciar sesión</Button>
          <button type="button" className="burger" onClick={() => setAbierto(!abierto)}
            aria-expanded={abierto} aria-controls="menu-movil" aria-label={abierto ? "Cerrar menú" : "Abrir menú"}>
            <Icon name={abierto ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {abierto && (
          <motion.nav id="menu-movil" className="mobilenav" aria-label="Menú"
            initial={{ opacity: 0, transform: "translateY(-8px)" }}
            animate={{ opacity: 1, transform: "translateY(0px)" }}
            exit={{ opacity: 0, transform: "translateY(-6px)", transition: { duration: 0.15 } }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}>
            <ul className="container">
              {NAV.map(([to, label]) => <li key={to}><a href={to} onClick={() => setAbierto(false)}>{label}<Icon name="der" size={18} /></a></li>)}
              <li><Link to="/admin" onClick={() => setAbierto(false)}>Panel CEMujeres<Icon name="der" size={18} /></Link></li>
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
