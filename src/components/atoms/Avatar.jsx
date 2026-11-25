const COLORES = ["var(--avatar-1)", "var(--avatar-2)", "var(--avatar-3)", "var(--avatar-4)", "var(--avatar-5)", "var(--avatar-6)"];

/** Avatar con iniciales y color estable por nombre. */
export function Avatar({ nombre = "?", size = 40 }) {
  const iniciales = nombre.replace(/\(.*\)/, "").trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const color = COLORES[[...nombre].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORES.length];
  return (
    <span className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.38 }} aria-hidden="true">
      {iniciales}
    </span>
  );
}
