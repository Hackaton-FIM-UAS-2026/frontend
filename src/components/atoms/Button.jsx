import { Link } from "react-router-dom";
import "./atoms.css";

const ALIAS = { accent: "secondary", urgent: "danger" };

/**
 * Botón del sistema. Con `to` se renderiza como <Link>, con `href` como <a>:
 * así nunca anidamos un botón dentro de un enlace.
 * variant: primary | secondary | ghost | quiet | light | danger | link
 * size: md | sm
 */
export function Button({ variant = "primary", size = "md", block, loading, to, href, className = "", children, ...p }) {
  const v = ALIAS[variant] || variant;
  const cls = ["btn", `btn--${v}`, size === "sm" && "btn--sm", block && "btn--block", className].filter(Boolean).join(" ");
  const inner = (
    <>
      {children}
      {loading && <span className="btn__spinner" aria-hidden="true" />}
    </>
  );
  if (to) return <Link to={to} className={cls} {...p}>{inner}</Link>;
  if (href) return <a href={href} className={cls} {...p}>{inner}</a>;
  return (
    <button type="button" className={cls} aria-busy={loading || undefined} {...p} disabled={p.disabled || loading}>
      {inner}
    </button>
  );
}
