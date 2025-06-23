"use client";
import React from "react";
import { PromptForm } from "../PromptForm";
import { getExpandedMenuStyles } from "../../styles/expanded-menu-styles";

interface ExpandedMenuProps {
  bubblePosition: { top: number; left: number };
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onSubmitPrompt: (e: React.FormEvent) => void;
  selectedElementsCount: number;
  isDarkMode: boolean;
}

export const ExpandedMenu: React.FC<ExpandedMenuProps> = ({
  bubblePosition,
  userPrompt,
  setUserPrompt,
  onSubmitPrompt,
  selectedElementsCount,
  isDarkMode,
}) => {
  const styles = getExpandedMenuStyles(bubblePosition.top, bubblePosition.left, isDarkMode);
  return (
    <div className="element-inspector-controls" style={styles.container}>
      <PromptForm
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        handlePromptSubmit={onSubmitPrompt}
        selectedElementsCount={selectedElementsCount}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};
