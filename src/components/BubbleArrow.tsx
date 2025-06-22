"use client";
import React from 'react';
import { elements } from '../styles';

interface BubbleArrowProps {
  /**
   * The top position of the arrow
   */
  top: number;
  
  /**
   * The left position of the arrow
   */
  left: number;
  
  /**
   * Whether the menu is positioned above the selected element
   */
  isAboveElement: boolean;
  
  /**
   * Whether dark mode is active
   */
  isDarkMode: boolean;
  
  /**
   * Whether the arrow should be visible
   */
  visible: boolean;
}

/**
 * Arrow indicator that points to the selected element
 */
export function BubbleArrow({
  top,
  left,
  isAboveElement,
  isDarkMode,
  visible
}: BubbleArrowProps) {
  return (
    <div
      style={{
        ...elements.menuArrow,
        top: isAboveElement 
          ? `${top + 75}px` // If menu is above element, arrow is at bottom of menu
          : `${top - 8}px`,  // If menu is below element, arrow is at top of menu
        left: `${left}px`,
        borderTop: isAboveElement ? `8px solid ${isDarkMode ? '#1f2937' : 'white'}` : 'none',
        borderBottom: isAboveElement ? 'none' : `8px solid ${isDarkMode ? '#1f2937' : 'white'}`,
        pointerEvents: 'none', // Ensure arrow doesn't interfere with mouse events
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true" // Accessibility - this is decorative
    />
  );
}
