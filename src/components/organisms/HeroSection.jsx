import { Link } from "react-router-dom";
import { Button, Pattern, ArcosIlustracion } from "../atoms";

export function HeroSection() {
  return (
    <section className="hero">
      <Pattern />
      <div className="hero__in">
        <div className="hero__text">
          <p className="hero__eyebrow">Plataforma para mujeres · Los Mochis, Sinaloa</p>
          <h1>Encuentra tu siguiente <em>paso económico</em></h1>
          <p className="hero__lead">
            En 5 minutos te decimos qué curso, vacante, beca o apoyo es para ti, por qué, y
            solo te preguntamos lo que de verdad falta.
          </p>
          <div className="hero__cta">
            <Link to="/registro"><Button>Comenzar mi test</Button></Link>
            <a href="#como"><Button variant="ghost">¿Cómo funciona?</Button></a>
          </div>
        </div>
        <div className="hero__art"><ArcosIlustracion /></div>
      </div>
      <div className="hero__band" />
    </section>
  );
}
