"use client";
import React from 'react';

/**
 * Styles for the ElementSelector component
 */
export const elementSelectorStyles = {
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    height: '100vh',
    width: '100vw',
    cursor: 'cell',
    zIndex: 9999,
    pointerEvents: 'auto',
  } as React.CSSProperties
};
