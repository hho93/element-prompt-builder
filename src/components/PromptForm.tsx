"use client";
import React from "react";
import { IconTick, IconAi } from "../Icons";
import { 
  formContainerStyles, 
  getPromptTextareaStyles,
  submitButtonStyles
} from "../styles/form-styles";

interface PromptFormProps {
  /**
   * The current prompt text
   */
  userPrompt: string;
  
  /**
   * Function to update the prompt text
   */
  setUserPrompt: (value: string) => void;
  
  /**
   * Form submission handler
   */
  handlePromptSubmit: (e: React.FormEvent) => void;
  
  /**
   * Number of elements currently selected
   */
  selectedElementsCount: number;
  
  /**
   * Whether dark mode is active
   */
  isDarkMode: boolean;
}

/**
 * Form component for entering and submitting prompts for selected elements
 */
export function PromptForm({
  userPrompt,
  setUserPrompt,
  handlePromptSubmit,
  selectedElementsCount,
  isDarkMode,
}: PromptFormProps) {
  const textareaStyles = getPromptTextareaStyles(isDarkMode, selectedElementsCount);
  
  return (
    <form onSubmit={handlePromptSubmit}>
      <div style={formContainerStyles.wrapper}>
        <div style={formContainerStyles.inputWrapper}>
          <div className="mt-1"><IconAi /></div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            style={textareaStyles.textarea}
            placeholder={"Tell me how to modify this element...\nI can help change its style, content, or\nbehavior."}
          />
        </div>
        {userPrompt.trim() !== "" && (
          <button
            type="submit"
            style={submitButtonStyles.button}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = submitButtonStyles.hoverBackgroundColor;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = submitButtonStyles.normalBackgroundColor;
            }}
          >
            <IconTick />
          </button>
        )}
      </div>
    </form>
  );
}
