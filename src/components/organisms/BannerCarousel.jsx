import { Link } from "react-router-dom";
import { Icon } from "../atoms";

const ACCESOS = [
  { icon: "reloj", titulo: "Tu siguiente paso, en 5 minutos",
    texto: "Un test corto de 12 preguntas, una por pantalla, hecho para contestar desde el celular.",
    cta: ["Comenzar", "/registro"], principal: true },
  { icon: "escudo", titulo: "Solo recursos reales y verificados",
    texto: "No inventamos oportunidades: elegimos de un catálogo curado y verificado en noviembre 2026.",
    cta: ["Ver tipos de recursos", "#recursos"] },
  { icon: "corazon", titulo: "¿Necesitas otro tipo de apoyo?",
    texto: "Orientación jurídica o psicológica de SEMujeres, solo si tú lo decides.",
    cta: ["Conocer más", "#apoyo"] },
];

/**
 * Antes carrusel; ahora tres accesos fijos y visibles a la vez.
 * Se conserva el nombre del componente para no romper importaciones.
 */
export function BannerCarousel() {
  return (
    <section className="accesos container" aria-label="Accesos rápidos">
      {ACCESOS.map((a) => {
        const content = (
          <>
            <span className="acceso__icon"><Icon name={a.icon} size={22} /></span>
            <h2 className="acceso__titulo">{a.titulo}</h2>
            <p className="acceso__texto">{a.texto}</p>
            <span className="card__more">{a.cta[0]} <Icon name="flecha" size={16} /></span>
          </>
        );
        const cls = `card card--link acceso ${a.principal ? "card--brand acceso--principal" : ""}`;
        return a.cta[1].startsWith("#")
          ? <a key={a.titulo} href={a.cta[1]} className={cls}>{content}</a>
          : <Link key={a.titulo} to={a.cta[1]} className={cls}>{content}</Link>;
      })}
    </section>
  );
}
