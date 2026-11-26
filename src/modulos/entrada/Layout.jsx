import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { Logo, Icon } from "../../components/atoms";
import "./estilos.css";

const ENTRA = {
  initial: { opacity: 0, transform: "translateY(8px)" },
  animate: { opacity: 1, transform: "translateY(0px)" },
  transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
};

/** Celular: barra + formulario. Escritorio (≥ 960 px): panel morado de marca + formulario. */
export function EntradaLayout({ regresar, children }) {
  return (
    <div className="m1">
      <aside className="m1-marca" aria-hidden="true">
        <Logo light />
        <div>
          <p className="m1-marca__titulo">Tu siguiente paso empieza aquí</p>
          <p className="m1-marca__texto">Trabajo, cursos, becas y apoyos de Ahome, elegidos para ti. Y si lo necesitas, SEMujeres te acompaña.</p>
        </div>
        <p className="m1-marca__texto">Una plataforma de la Secretaría de las Mujeres de Ahome</p>
      </aside>
      <div className="m1-lado">
        <header className="m1-barra">
          {regresar
            ? <Link to={regresar.to} className="btn btn--link btn--sm"><Icon name="izq" size={18} /> {regresar.texto}</Link>
            : <Link to="/" className="m1-barra__logo" aria-label="Empoderate, inicio"><Logo /></Link>}
          {/* En escritorio el logo ya está en el panel morado: esta barra solo se ve en celular */}
        </header>
        <motion.main id="contenido" className="m1-form" {...ENTRA}>{children}</motion.main>
      </div>
    </div>
  );
}
