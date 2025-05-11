'use client';

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps
  extends Readonly<ButtonHTMLAttributes<HTMLButtonElement>> {
  readonly variant?: 'primary' | 'secondary' | 'outline';
  readonly size?: 'sm' | 'md' | 'lg';
}

const getButtonClasses = (
  variant: string,
  size: string,
  className?: string
): string => {
  const baseClasses =
    'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  const variantClasses = {
    primary:
      'bg-yellow-400 text-black hover:bg-yellow-500 focus:ring-yellow-400',
    secondary: 'bg-gray-800 text-white hover:bg-gray-900 focus:ring-gray-800',
    outline:
      'border-2 border-gray-800 text-gray-800 hover:bg-gray-100 focus:ring-gray-800',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return `${baseClasses} ${variantClasses[variant as keyof typeof variantClasses]} ${sizeClasses[size as keyof typeof sizeClasses]} ${className ?? ''}`;
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps): React.ReactElement {
  return (
    <button className={getButtonClasses(variant, size, className)} {...props}>
      {children}
    </button>
  );
}
