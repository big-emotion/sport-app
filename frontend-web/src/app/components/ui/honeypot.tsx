import React, { useState } from 'react';

interface HoneypotProps {
  name?: string;
}

export default function Honeypot() {
  const [filled, setFilled] = useState(false);

  return (
    <div>
      <input
        type="text"
        name="rib"
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
        onChange={e => setFilled(!!e.target.value)}
      />
    </div>
  );
}
