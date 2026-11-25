/** Filete de marca: una línea sólida y fina (sustituye a la franja multicolor). */
export function Franja({ alto = 3, light }) {
  return <div className={`franja ${light ? "franja--light" : ""}`} style={{ height: alto }} aria-hidden="true" />;
}
