import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, Pattern } from "../atoms";

const SLIDES = [
  { tono: "morado", titulo: "Tu siguiente paso, en 5 minutos",
    texto: "Un test corto de 12 preguntas, una por pantalla, hecho para contestar desde el celular.",
    cta: ["Comenzar", "/registro"] },
  { tono: "guinda", titulo: "Solo recursos reales y verificados",
    texto: "No inventamos oportunidades: elegimos de un catálogo curado y verificado en noviembre 2026.",
    cta: ["Ver tipos de recursos", "#recursos"] },
  { tono: "turquesa", titulo: "¿Necesitas otro tipo de apoyo?",
    texto: "Orientación jurídica o psicológica de CEMujeres, solo si tú lo decides.",
    cta: ["Conocer más", "#apoyo"] },
];

/** Carrusel manual (sin autoplay: cuida los datos móviles). */
export function BannerCarousel() {
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  return (
    <section className="banner-wrap" aria-roledescription="carrusel">
      <div className={`banner banner--${s.tono}`}>
        <Pattern color="#fff" opacity={0.1} />
        <button className="banner__arrow" onClick={() => setI((i + SLIDES.length - 1) % SLIDES.length)} aria-label="Anterior">‹</button>
        <div className="banner__body">
          <h2>{s.titulo}</h2>
          <p>{s.texto}</p>
          {s.cta[1].startsWith("#")
            ? <a href={s.cta[1]}><Button variant="light">{s.cta[0]}</Button></a>
            : <Link to={s.cta[1]}><Button variant="light">{s.cta[0]}</Button></Link>}
        </div>
        <button className="banner__arrow" onClick={() => setI((i + 1) % SLIDES.length)} aria-label="Siguiente">›</button>
      </div>
      <div className="dots">
        {SLIDES.map((_, n) => (
          <button key={n} className={`dot ${n === i ? "dot--on" : ""}`} onClick={() => setI(n)} aria-label={`Banner ${n + 1}`} />
        ))}
      </div>
    </section>
  );
}
