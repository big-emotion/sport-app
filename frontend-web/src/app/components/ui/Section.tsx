'use client';

import React, { ReactNode } from 'react';

interface SectionProps {
  readonly children: ReactNode;
  readonly className?: string;
  readonly id?: string;
  readonly fullWidth?: boolean;
}

export function Section({
  children,
  className,
  id,
  fullWidth = false,
}: SectionProps): React.ReactElement {
  return (
    <section id={id} className={`py-12 md:py-16 ${className ?? ''}`}>
      <div
        className={`mx-auto px-4 sm:px-6 lg:px-8 [&:not(.full-width)]:max-w-7xl ${fullWidth ? 'full-width' : ''}`}
      >
        {children}
      </div>
    </section>
  );
}
