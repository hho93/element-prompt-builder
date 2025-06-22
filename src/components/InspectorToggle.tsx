"use client";
import React from "react";
import { IconPointer } from "../Icons";
import { buttons, darkMode, layout, states, text } from "../styles";

interface InspectorToggleProps {
  /**
   * Whether the inspector is currently active
   */
  isInspecting: boolean;
  
  /**
   * The number of currently selected elements
   */
  selectedCount: number;
  
  /**
   * Function to toggle inspection mode
   */
  toggleInspection: () => void;
  
  /**
   * Whether dark mode is active
   */
  isDarkMode: boolean;
  
  /**
   * The maximum number of elements that can be selected
   */
  maxElements?: number;
}

/**
 * Toggle control for the element inspector with selection count
 */
export function InspectorToggle({
  isInspecting,
  selectedCount,
  toggleInspection,
  isDarkMode,
  maxElements = 5,
}: InspectorToggleProps) {
  return (
    <div style={layout.inspectorToggle}>
      <div style={layout.toggleLeft}>
        <IconPointer />
        <span
          style={{
            ...text.toggleText,
            ...(isDarkMode ? darkMode.toggleText : {}),
          }}
        >
          Inspection Mode
        </span>
      </div>
      <div style={layout.toggleRight}>
        {selectedCount > 0 && (
          <span
            style={{
              ...text.selectedCount,
              ...(isDarkMode ? darkMode.selectedCount : {}),
            }}
          >
            {selectedCount}/{maxElements} selected
          </span>
        )}
        <button
          onClick={toggleInspection}
          style={{
            ...buttons.toggleButton,
            ...(isInspecting
              ? isDarkMode
                ? { ...darkMode.toggleButtonActive }
                : { ...states.toggleButtonActive }
              : isDarkMode
                ? { ...darkMode.toggleButtonInactive }
                : { ...states.toggleButtonInactive }),
          }}
        >
          {isInspecting ? "Active" : "Inactive"}
        </button>
      </div>
    </div>
  );
}
