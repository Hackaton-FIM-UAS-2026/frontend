import { Check } from "../atoms";
export function RequirementItem({ label, ok, onResolve }) {
  return (
    <li className={`req ${ok ? "req--ok" : "req--falta"}`}>
      <Check ok={ok} />
      <span className="req__label">{label}</span>
      {!ok && onResolve && <button className="req__btn" onClick={onResolve}>Resolver</button>}
    </li>
  );
}
