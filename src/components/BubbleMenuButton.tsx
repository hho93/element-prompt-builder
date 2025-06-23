"use client";
import React from "react";
import { IconSquareDashedPointer } from "../Icons";
import { getBubbleMenuButtonStyles } from "../styles/bubble-button-styles";

interface BubbleMenuButtonProps {
  /**
   * Whether the inspector is currently active
   */
  isInspecting: boolean;

  /**
   * Click handler for the button
   */
  onClick: () => void;
}

/**
 * The main floating button for toggling the element inspector
 */
export function BubbleMenuButton({
  isInspecting,
  onClick,
}: BubbleMenuButtonProps) {
  const title = isInspecting
    ? "Disable Element Inspector"
    : "Enable Element Inspector";
  const styles = getBubbleMenuButtonStyles(isInspecting);
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = styles.hoverBackgroundColor;
  };
  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.backgroundColor = styles.normalBackgroundColor;
  };

  return (
    <button
      onClick={onClick}
      style={styles.button}
      onMouseOver={handleMouseOver}
      onMouseOut={handleMouseOut}
      title={title}
    >
      <IconSquareDashedPointer />
    </button>
  );
}
