import { Button, Check } from "../atoms";

export function RequirementItem({ label, ok, onResolve }) {
  return (
    <li className={`req ${ok ? "req--ok" : "req--falta"}`}>
      <Check ok={ok} />
      <span className="req__label">{label}</span>
      {!ok && onResolve && <Button variant="quiet" size="sm" onClick={onResolve}>Resolver</Button>}
    </li>
  );
}
