import { useId } from "react";

/** Campo con etiqueta visible, pista y error. as: "input" | "select" | "textarea" */
export function Input({ label, id, hint, error, as: Tag = "input", className = "", children, ...p }) {
  const auto = useId();
  const fid = id || auto;
  const desc = [hint && `${fid}-hint`, error && `${fid}-err`].filter(Boolean).join(" ") || undefined;
  return (
    <div className={`field ${className}`}>
      <label className="field__label" htmlFor={fid}>{label}</label>
      <Tag id={fid} className="input" aria-describedby={desc} aria-invalid={error ? true : undefined} {...p}>
        {children}
      </Tag>
      {hint && <span id={`${fid}-hint`} className="field__hint">{hint}</span>}
      {error && <span id={`${fid}-err`} className="field__error">{error}</span>}
    </div>
  );
}
