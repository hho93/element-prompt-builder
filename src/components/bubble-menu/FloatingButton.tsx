"use client";
import React from "react";
import { BubbleMenuButton } from "../BubbleMenuButton";
import { floatingButtonStyles } from "../../styles/bubble-menu-styles";

interface FloatingButtonProps {
  isInspecting: boolean;
  onToggle: () => void;
}

export const FloatingButton: React.FC<FloatingButtonProps> = ({
  isInspecting,
  onToggle,
}) => {
  return (
    <div
      className="element-inspector-floating-button-container"
      style={floatingButtonStyles.container}
    >
      <BubbleMenuButton isInspecting={isInspecting} onClick={onToggle} />
    </div>
  );
};
