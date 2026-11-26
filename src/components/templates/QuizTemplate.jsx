import { Pattern } from "../atoms";

/** Pantalla completa dividida: panel de color (aside) + zona de la pregunta. */
export function QuizTemplate({ aside, children }) {
  return (
    <div className="quiz">
      <aside className="quiz__aside">{aside}</aside>
      <main className="quiz__main">
        <Pattern color="var(--morado-300)" opacity={0.16} />
        <div className="quiz__content">{children}</div>
      </main>
    </div>
  );
}
