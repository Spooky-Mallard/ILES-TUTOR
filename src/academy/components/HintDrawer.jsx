import { useState } from 'react';

export default function HintDrawer({ hints }) {
  const [open, setOpen] = useState(false);

  if (!hints?.length) return null;

  return (
    <div className="hint-drawer">
      <button className="hint-toggle" onClick={() => setOpen(o => !o)}>
        💡 {open ? 'Hide Hints' : `Show Hints (${hints.length})`}
      </button>
      {open && (
        <div className="hint-panel">
          <h4>Hints</h4>
          <ul className="hint-list">
            {hints.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
