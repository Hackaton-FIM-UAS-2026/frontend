import { SkipLink } from "./Templates.jsx";

/** Pantalla completa dividida: panel de marca (aside) + zona de la pregunta. */
export function QuizTemplate({ aside, children }) {
  return (
    <div className="quiz">
      <SkipLink />
      <aside className="quiz__aside">{aside}</aside>
      <main id="contenido" className="quiz__main">
        <div className="quiz__content">{children}</div>
      </main>
    </div>
  );
}
