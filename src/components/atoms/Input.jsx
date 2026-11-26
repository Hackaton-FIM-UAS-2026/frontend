export function Input({ label, id, ...p }) {
  return (
    <label className="field" htmlFor={id}>
      <span className="field__label">{label}</span>
      <input id={id} className="input" {...p} />
    </label>
  );
}
