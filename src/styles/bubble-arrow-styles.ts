"use client";
import { elements } from './base-styles';

/**
 * Styles for the BubbleArrow component
 */
export const getBubbleArrowStyles = (
  top: number,
  left: number,
  isAboveElement: boolean,
  isDarkMode: boolean,
  visible: boolean
) => {
  return {
    arrow: {
      ...elements.menuArrow,
      top: isAboveElement 
        ? `${top + 75}px` // If menu is above element, arrow is at bottom of menu
        : `${top - 8}px`,  // If menu is below element, arrow is at top of menu
      left: `${left}px`,
      borderTop: isAboveElement ? `8px solid ${isDarkMode ? '#1f2937' : 'white'}` : 'none',
      borderBottom: isAboveElement ? 'none' : `8px solid ${isDarkMode ? '#1f2937' : 'white'}`,
      pointerEvents: 'none', // Ensure arrow doesn't interfere with mouse events
      opacity: visible ? 1 : 0,
    } as React.CSSProperties
  };
};
