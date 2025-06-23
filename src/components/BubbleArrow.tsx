"use client";
import React from 'react';
import { getBubbleArrowStyles } from '../styles/bubble-arrow-styles';

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
  const styles = getBubbleArrowStyles(top, left, isAboveElement, isDarkMode, visible);
  
  return (
    <div
      style={styles.arrow}
      aria-hidden="true" // Accessibility - this is decorative
    />
  );
}
