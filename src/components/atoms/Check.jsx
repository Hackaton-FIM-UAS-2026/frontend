/** Indicador cumple / falta. La palomita se dibuja al pasar a ok. */
export function Check({ ok }) {
  return (
    <span className={`check ${ok ? "check--ok" : "check--falta"}`} role="img" aria-label={ok ? "Cumples" : "Te falta"}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
        strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {ok
          ? <path className="check__path" d="M5 12.5l4.5 4.5L19 7.5" />
          : <circle cx="12" cy="12" r="2.5" fill="currentColor" stroke="none" />}
      </svg>
    </span>
  );
}
