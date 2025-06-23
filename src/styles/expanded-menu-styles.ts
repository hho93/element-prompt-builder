"use client";
import { layout, darkMode } from './base-styles';

/**
 * Styles for the ExpandedMenu component
 */
export const getExpandedMenuStyles = (
  top: number,
  left: number,
  isDarkMode: boolean
) => {
  return {
    container: {
      ...layout.expandedMenu,
      ...(isDarkMode ? darkMode.expandedMenu : {}),
      padding: '16px',
      position: 'fixed', // Use fixed to stay consistent with scroll position
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 10000,
      maxHeight: '400px', // Ensure it doesn't get too large
      overflowY: 'auto', // Add scrolling if needed
    } as React.CSSProperties
  };
};
