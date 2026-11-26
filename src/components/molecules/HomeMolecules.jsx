import { Icon } from "../atoms";

/** Tarjeta con icono, título y texto. tone = color de la franja superior (ruta o neutro). */
export function FeatureCard({ icon, title, children, tone = "morado", href }) {
  const Tag = href ? "a" : "div";
  return (
    <Tag className={`fcard fcard--${tone}`} href={href}>
      <span className="fcard__icon"><Icon name={icon} /></span>
      <h3>{title}</h3>
      <p>{children}</p>
      {href && <span className="fcard__more">Ver más <Icon name="flecha" size={18} /></span>}
    </Tag>
  );
}

export function StepItem({ n, title, children }) {
  return (
    <li className="step">
      <span className="step__n">{n}</span>
      <div><h3>{title}</h3><p>{children}</p></div>
    </li>
  );
}

export function ResourceTypeTile({ icon, label, onClick }) {
  return (
    <button className="rtile" onClick={onClick}>
      <Icon name={icon} size={32} />
      <span>{label}</span>
    </button>
  );
}
