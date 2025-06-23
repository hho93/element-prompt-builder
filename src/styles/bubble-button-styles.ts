"use client";
import { buttons } from './base-styles';

/**
 * Styles for the BubbleMenuButton component
 */
export const getBubbleMenuButtonStyles = (isInspecting: boolean) => {
  return {
    button: {
      ...buttons.mainButton,
      backgroundColor: isInspecting ? '#2563eb' : '#93c5fd', // Lighter blue when not enabled
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
    } as React.CSSProperties,
    
    hoverBackgroundColor: isInspecting ? '#1d4ed8' : '#60a5fa', // Darker on hover but still lighter than active
    normalBackgroundColor: isInspecting ? '#2563eb' : '#93c5fd'
  };
};
