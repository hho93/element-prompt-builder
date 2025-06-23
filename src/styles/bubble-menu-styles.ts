"use client";
import { UI_CONSTANTS } from "../constants";

/**
 * Generates styles for the menu arrow component
 */
export const getMenuArrowStyles = (
  isMenuAboveElement: boolean,
  bubblePosition: { top: number; left: number },
  isDarkMode: boolean,
  isVisible: boolean,
) => {
  const topPosition = isMenuAboveElement
    ? `${bubblePosition.top + UI_CONSTANTS.MENU_HEIGHT}px` // Arrow at bottom of menu
    : `${bubblePosition.top - 8}px`; // Arrow at top of menu

  const leftPosition = `${bubblePosition.left + UI_CONSTANTS.ARROW_LEFT_OFFSET}px`;

  const borderTop = isMenuAboveElement
    ? `8px solid ${isDarkMode ? "#1f2937" : "white"}`
    : "none";

  const borderBottom = isMenuAboveElement
    ? "none"
    : `8px solid ${isDarkMode ? "#1f2937" : "white"}`;

  return {
    menuArrow: {
      position: "fixed",
      width: 0,
      height: 0,
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      top: topPosition,
      left: leftPosition,
      borderTop,
      borderBottom,
      pointerEvents: "none",
      opacity: isVisible ? 1 : 0,
      zIndex: UI_CONSTANTS.Z_INDEX + 1,
    } as React.CSSProperties,
  };
};

/**
 * Styles for the floating button container
 */
export const floatingButtonStyles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: UI_CONSTANTS.Z_INDEX,
  } as React.CSSProperties,
};

/**
 * Styles for the bubble container
 */
export const bubbleStyles = {
  container: {
    position: "static",
  } as React.CSSProperties,
};
