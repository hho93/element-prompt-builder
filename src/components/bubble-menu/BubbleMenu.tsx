"use client";
import React from "react";
import { MenuArrow } from "./MenuArrow";
import { ExpandedMenu } from "./ExpandedMenu";
import { FloatingButton } from "./FloatingButton";

interface BubbleMenuProps {
  isInspecting: boolean;
  selectedElements: HTMLElement[];
  bubblePosition: { top: number; left: number };
  isMenuAboveElement: boolean;
  userPrompt: string;
  setUserPrompt: (prompt: string) => void;
  onSubmitPrompt: (e: React.FormEvent) => void;
  onToggleInspection: () => void;
  isDarkMode: boolean;
  showBubbleMenuButton: boolean;
}

export const BubbleMenu: React.FC<BubbleMenuProps> = ({
  isInspecting,
  selectedElements,
  bubblePosition,
  isMenuAboveElement,
  userPrompt,
  setUserPrompt,
  onSubmitPrompt,
  onToggleInspection,
  isDarkMode,
  showBubbleMenuButton,
}) => {
  const showMenu = isInspecting && selectedElements.length > 0;

  return (
    <div className="element-inspector-bubble">
      {/* Expanded Menu with Arrow */}
      {showMenu && (
        <>
          <MenuArrow
            isMenuAboveElement={isMenuAboveElement}
            bubblePosition={bubblePosition}
            isDarkMode={isDarkMode}
            isVisible={selectedElements.length > 0}
          />

          <ExpandedMenu
            bubblePosition={bubblePosition}
            userPrompt={userPrompt}
            setUserPrompt={setUserPrompt}
            onSubmitPrompt={onSubmitPrompt}
            selectedElementsCount={selectedElements.length}
            isDarkMode={isDarkMode}
          />
        </>
      )}

      {/* Floating Button */}
      {showBubbleMenuButton && (
        <FloatingButton
          isInspecting={isInspecting}
          onToggle={onToggleInspection}
        />
      )}
    </div>
  );
};
