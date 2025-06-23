"use client";
import React from 'react';

/**
 * Styles for the ElementHighlighter component
 */
export const getHighlighterStyles = (
  borderColor: string = 'rgba(59, 130, 246, 0.8)',
  backgroundColor: string = 'rgba(59, 130, 246, 0.2)',
  customStyles: React.CSSProperties = {}
) => {
  return {
    container: {
      position: 'fixed',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      border: `2px solid ${borderColor}`,
      backgroundColor,
      transition: 'all 100ms',
      zIndex: 9998,
      pointerEvents: 'none',
      ...customStyles,
    } as React.CSSProperties
  };
};
