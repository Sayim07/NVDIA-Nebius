'use client';

import React from 'react';

export const Magnetic: React.FC<{
  children: React.ReactElement;
  strength?: number;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`inline-block ${className}`}>
      {children}
    </div>
  );
};
