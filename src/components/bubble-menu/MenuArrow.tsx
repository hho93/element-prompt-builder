"use client";
import React from "react";
import { getMenuArrowStyles } from "../../styles/bubble-menu-styles";

interface MenuArrowProps {
  isMenuAboveElement: boolean;
  bubblePosition: { top: number; left: number };
  isDarkMode: boolean;
  isVisible: boolean;
}

export const MenuArrow: React.FC<MenuArrowProps> = ({
  isMenuAboveElement,
  bubblePosition,
  isDarkMode,
  isVisible,
}) => {
  const styles = getMenuArrowStyles(
    isMenuAboveElement,
    bubblePosition,
    isDarkMode,
    isVisible,
  );
  return (
    <div
      className="element-inspector-menu-arrow"
      style={styles.menuArrow}
      aria-hidden="true"
    />
  );
};
