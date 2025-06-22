"use client";
import React from "react";
import { IconSquareDashedPointer } from "../Icons";
import { buttons } from "../styles";

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
  return (
    <button
      onClick={onClick}
      style={{
        ...buttons.mainButton,
        backgroundColor: isInspecting ? '#2563eb' : '#93c5fd', // Lighter blue when not enabled
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor =
          isInspecting ? '#1d4ed8' : '#60a5fa'; // Darker on hover but still lighter than active
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor =
          isInspecting ? '#2563eb' : '#93c5fd';
      }}
      title={isInspecting ? "Disable Element Inspector" : "Enable Element Inspector"}
    >
      <IconSquareDashedPointer />
    </button>
  );
}
