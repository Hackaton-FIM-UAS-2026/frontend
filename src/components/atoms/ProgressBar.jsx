export function ProgressBar({ value, max, label }) {
  const pct = Math.round((value / max) * 100);
  return (
    <div className="progress" role="progressbar" aria-valuenow={value} aria-valuemax={max} aria-label={label}>
      <div className="progress__fill" style={{ width: `${pct}%` }} />
    </div>
  );
}
