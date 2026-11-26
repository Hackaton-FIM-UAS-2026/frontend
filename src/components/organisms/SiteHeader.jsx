import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { Logo, Icon, Button } from "../atoms";
import { TEMAS } from "../../modulos/portada/datos.js";

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

/** Barra de la landing: cada tema abre su página (≥ 1100 px); en celular, menú desplegable. */
export function SiteHeader() {
  const [abierto, setAbierto] = useState(false);
  const conScroll = useConScroll();
  const { pathname } = useLocation();

  useEffect(() => { setAbierto(false); }, [pathname]);
  useEffect(() => {
    if (!abierto) return;
    const esc = (e) => e.key === "Escape" && setAbierto(false);
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, [abierto]);

  return (
    <header className={`sitehead ${conScroll || abierto ? "sitehead--scrolled" : ""}`}>
      <div className="sitehead__in container">
        <Link to="/" className="sitehead__logo" aria-label="Empoderate, inicio"><Logo /></Link>

        <nav className="sitenav" aria-label="Principal">
          <ul>{TEMAS.map(([to, label]) => (
            <li key={to}><NavLink to={to} className={({ isActive }) => (isActive ? "sitenav__on" : undefined)}>{label}</NavLink></li>
          ))}</ul>
        </nav>

        <div className="sitehead__tools">
          <Button to="/entrar" size="sm" variant="link" className="sitehead__entrar">Entrar</Button>
          <Button to="/registro" size="sm" className="sitehead__login">Comenzar</Button>
          <button type="button" className="burger" onClick={() => setAbierto(!abierto)}
            aria-expanded={abierto} aria-controls="menu-movil" aria-label={abierto ? "Cerrar menú" : "Abrir menú"}>
            <Icon name={abierto ? "x" : "menu"} size={24} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {abierto && (
          <>
            <motion.div className="mobilenav__velo" onClick={() => setAbierto(false)} aria-hidden="true"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }} />
            <motion.nav id="menu-movil" className="mobilenav" aria-label="Menú"
              initial={{ opacity: 0, transform: "translateY(-8px)" }}
              animate={{ opacity: 1, transform: "translateY(0px)" }}
              exit={{ opacity: 0, transform: "translateY(-6px)", transition: { duration: 0.15 } }}
              transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}>
              <ul className="container">
                {TEMAS.map(([to, label]) => <li key={to}><Link to={to}>{label}<Icon name="der" size={18} /></Link></li>)}
                <li className="mobilenav__cta"><Button block to="/registro">Comenzar</Button></li>
                <li className="mobilenav__cta"><Button block variant="ghost" to="/entrar">Ya tengo cuenta: entrar</Button></li>
              </ul>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
