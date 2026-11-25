/** tone: neutral | primary | success | warning | danger | info | empleabilidad | emprendimiento | capacitacion */
export function Badge({ tone = "primary", dot, children }) {
  return <span className={`badge badge--${tone} ${dot ? "badge--dot" : ""}`}>{children}</span>;
}
