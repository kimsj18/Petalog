import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'default' | 'narrow' | 'wide';
}

export function Container({ children, className = '', size = 'default' }: ContainerProps) {
  const maxWidthClass = {
    default: 'max-w-7xl',
    narrow: 'max-w-2xl',
    wide: 'max-w-[1920px]',
  }[size];

  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

