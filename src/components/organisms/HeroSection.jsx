import { motion } from "motion/react";
import { Button, Icon, CaminoIlustracion } from "../atoms";
import { destino } from "../../modulos/registro";

const sube = (delay) => ({
  initial: { opacity: 0, transform: "translateY(12px)" },
  animate: { opacity: 1, transform: "translateY(0px)" },
  transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
});

/** Hero del portal: la única entrada animada de la página. */
export function HeroSection() {
  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <div className="hero__in container">
        <div className="hero__text">
          <motion.h1 id="hero-titulo" {...sube(0)}>Encuentra tu siguiente <em>paso económico</em></motion.h1>
          <motion.p className="hero__lead" {...sube(0.06)}>
            Te decimos qué trabajo, curso, beca o apoyo es para ti, por qué, y cómo llegar.
            Gratis y desde tu celular.
          </motion.p>
          <motion.div className="hero__cta" {...sube(0.12)}>
            <Button to={destino("/entrar", "/registro")}>Comenzar</Button>
            <Button to="/como-funciona" variant="ghost">¿Cómo funciona?</Button>
          </motion.div>
          <motion.p className="hero__place" {...sube(0.18)}>
            <Icon name="ubicacion" size={16} /> Secretaría de las Mujeres · Ahome, Sinaloa
          </motion.p>
        </div>
        <motion.div className="hero__art"
          initial={{ opacity: 0, transform: "scale(0.97)" }} animate={{ opacity: 1, transform: "scale(1)" }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}>
          <CaminoIlustracion />
        </motion.div>
      </div>
    </section>
  );
}
