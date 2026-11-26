import { SkipLink } from "./Templates.jsx";
import { useRequiereSesion } from "../../services/useSesion";

/** Pantalla completa dividida: panel de marca (aside) + zona de la pregunta. */

export function QuizTemplate({ aside, children }) {
  const lista = useRequiereSesion();
  if (!lista) return null;
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
