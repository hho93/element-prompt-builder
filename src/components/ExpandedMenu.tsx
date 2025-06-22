"use client";
import React from 'react';
import { PromptForm } from './PromptForm';
import { layout, darkMode } from '../styles';

interface ExpandedMenuProps {
  /**
   * The top position of the menu
   */
  top: number;
  
  /**
   * The left position of the menu
   */
  left: number;
  
  /**
   * Whether dark mode is active
   */
  isDarkMode: boolean;
  
  /**
   * The current prompt text
   */
  userPrompt: string;
  
  /**
   * Function to update the prompt text
   */
  setUserPrompt: (prompt: string) => void;
  
  /**
   * Form submission handler
   */
  handlePromptSubmit: (e: React.FormEvent) => void;
  
  /**
   * Number of elements currently selected
   */
  selectedElementsCount: number;
}

/**
 * Expanded menu component that contains the prompt form
 */
export function ExpandedMenu({
  top,
  left,
  isDarkMode,
  userPrompt,
  setUserPrompt,
  handlePromptSubmit,
  selectedElementsCount
}: ExpandedMenuProps) {
  return (
    <div 
      className="element-inspector-controls"
      style={{
        ...layout.expandedMenu,
        ...(isDarkMode ? darkMode.expandedMenu : {}),
        padding: '16px',
        position: 'fixed', // Use fixed to stay consistent with scroll position
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 10000,
        maxHeight: '400px', // Ensure it doesn't get too large
        overflowY: 'auto', // Add scrolling if needed
        height: '75px', // Set actual height to match our calculations
      }}
    >
      {/* Prompt Input */}
      <PromptForm
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        handlePromptSubmit={handlePromptSubmit}
        selectedElementsCount={selectedElementsCount}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}
