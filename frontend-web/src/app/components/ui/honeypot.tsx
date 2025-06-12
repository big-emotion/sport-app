import React, { JSX, useState } from 'react';

export default function Honeypot(): JSX.Element {
  const [filled, setFilled] = useState<boolean>(false);

  return (
    <div>
      <input
        type="text"
        name="rib"
        autoComplete="off"
        tabIndex={-1}
        className="hidden"
        aria-hidden="true"
        onChange={e => setFilled(e.target.value !== '')}
        value={filled ? 'filled' : ''}
      />
    </div>
  );
}
