import React from 'react';

interface HonypotProps {
  name?: string;
}

export default function Honypot({ name = 'rib' }: HonypotProps) {
  return (
    <input
      type="text"
      name={name}
      autoComplete="off"
      tabIndex={-1}
      className="hidden"
      aria-hidden="true"
    />
  );
}
