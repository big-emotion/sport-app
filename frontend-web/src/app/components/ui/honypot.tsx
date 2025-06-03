import React, { useState } from 'react';

interface HonypotProps {
  name?: string;
}

export default function Honypot({ name = 'rib' }: HonypotProps) {
  const [filled, setFilled] = useState(false);

  return (
    <div>
      <input
        type="text"
        name={name}
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
        onChange={e => setFilled(!!e.target.value)}
      />
      {filled && (
        <div style={{ color: 'red', fontSize: 12 }}>
          Champ de validation rempli.
        </div>
      )}
    </div>
  );
}
