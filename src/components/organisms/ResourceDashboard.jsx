import { ResourceCard } from "../molecules";

const TITULOS = { curso: "Cursos", vacante: "Vacantes", beca: "Becas", apoyo: "Apoyos", financiamiento: "Financiamiento" };

/** Dashboard: hasta 10 recursos agrupados por tipo. */
export function ResourceDashboard({ recursos, onOpen }) {
  const grupos = recursos.reduce((acc, r) => ((acc[r.tipo] ||= []).push(r), acc), {});
  return (
    <div>
      {Object.entries(grupos).map(([tipo, lista]) => (
        <section key={tipo}>
          <h2>{TITULOS[tipo] || tipo}</h2>
          {lista.map((r) => <ResourceCard key={r.id} recurso={r} onOpen={onOpen} />)}
        </section>
      ))}
    </div>
  );
}
