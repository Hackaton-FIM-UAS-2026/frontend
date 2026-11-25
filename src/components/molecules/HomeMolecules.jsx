import { Link } from "react-router-dom";
import { Icon } from "../atoms";

/**
 * Tarjeta con icono, título y texto. `tone` se acepta por compatibilidad,
 * pero ya no pinta bordes de color: todas comparten la misma anatomía.
 */
export function FeatureCard({ icon, title, children, href, to }) {
  const content = (
    <>
      {icon && <span className="card__icon"><Icon name={icon} size={22} /></span>}
      <h3 className="card__title">{title}</h3>
      <p className="card__meta">{children}</p>
      {(href || to) && <span className="card__more">Ver más <Icon name="flecha" size={16} /></span>}
    </>
  );
  if (to) return <Link to={to} className="card card--link">{content}</Link>;
  if (href) return <a href={href} className="card card--link">{content}</a>;
  return <div className="card">{content}</div>;
}

export function StepItem({ n, title, children }) {
  return (
    <li className="step">
      <span className="step__n" aria-hidden="true">{n}</span>
      <div><h3>{title}</h3><p>{children}</p></div>
    </li>
  );
}

export function ResourceTypeTile({ icon, label, onClick }) {
  return (
    <button type="button" className="rtile" onClick={onClick}>
      <Icon name={icon} size={22} />
      <span>{label}</span>
    </button>
  );
}
