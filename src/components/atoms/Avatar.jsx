const COLORES = ["#a9489b", "#14a3b5", "#ec8216", "#6f8460", "#5b2c83", "#e8603c"];

/** Avatar con iniciales y color estable por nombre. */
export function Avatar({ nombre = "?", size = 40 }) {
  const iniciales = nombre.replace(/\(.*\)/, "").trim().split(/\s+/).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  const color = COLORES[[...nombre].reduce((a, c) => a + c.charCodeAt(0), 0) % COLORES.length];
  return (
    <span className="avatar" style={{ width: size, height: size, background: color, fontSize: size * 0.4 }} aria-hidden="true">
      {iniciales}
    </span>
  );
}
