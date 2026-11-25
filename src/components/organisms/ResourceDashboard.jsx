import { ResourceCard } from "../molecules";
import { Button, Icon } from "../atoms";

const TITULOS = { curso: "Cursos", vacante: "Vacantes", beca: "Becas", apoyo: "Apoyos", financiamiento: "Financiamiento" };

/** Dashboard: hasta 10 recursos agrupados por tipo. */
export function ResourceDashboard({ recursos, onOpen }) {
  if (!recursos.length) {
    return (
      <div className="card card--sunken empty">
        <span className="empty__icon"><Icon name="buscar" size={26} /></span>
        <h2 className="card__title">Aún no tenemos recursos para tu ruta</h2>
        <p className="muted">Contesta el test para que podamos recomendarte cursos, vacantes y apoyos que sí te cuadren.</p>
        <Button to="/test">Contestar el test</Button>
      </div>
    );
  }
  const grupos = recursos.reduce((acc, r) => ((acc[r.tipo] ||= []).push(r), acc), {});
  return (
    <div className="dash">
      {Object.entries(grupos).map(([tipo, lista]) => (
        <section key={tipo} className="dash__grupo" aria-labelledby={`g-${tipo}`}>
          <h2 id={`g-${tipo}`} className="dash__titulo">{TITULOS[tipo] || tipo} <span>{lista.length}</span></h2>
          <div className="dash__grid">
            {lista.map((r) => <ResourceCard key={r.id} recurso={r} onOpen={onOpen} />)}
          </div>
        </section>
      ))}
    </div>
  );
}
