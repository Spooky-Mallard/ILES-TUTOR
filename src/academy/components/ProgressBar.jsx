export default function ProgressBar({ completed, total, label }) {
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100);
  return (
    <div className="progress-row">
      {label && <span className="progress-label">{label}</span>}
      <div className="progress-bar-wrap">
        <div className="progress-bar-fill" style={{ width: `${pct}%` }} />
      </div>
      <span className="progress-label">{completed}/{total}</span>
    </div>
  );
}
