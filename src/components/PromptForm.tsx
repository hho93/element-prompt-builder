"use client";
import React from "react";
import { IconTick, IconAi } from "../Icons";
import { buttons, darkMode, inputs } from "../styles";

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
  return (
    <form onSubmit={handlePromptSubmit}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "8px",
          alignItems: "flex-start",
          width: "100%",
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          position: 'relative',
          gap: '5px',
          width: '100%' 
        }}>
          <div className="mt-1"><IconAi /></div>
          <textarea
            value={userPrompt}
            onChange={(e) => setUserPrompt(e.target.value)}
            style={{
              ...inputs.promptInput,
              ...(isDarkMode ? darkMode.promptInput : {}),
              ...(selectedElementsCount > 0 ? inputs.promptInputSelected : {}),
              resize: "none",
              minHeight: "62px", // Height for approximately 3 lines
              lineHeight: "1.5",
            }}
            placeholder={"Tell me how to modify this element...\nI can help change its style, content, or behavior."}
          />
        </div>
        {userPrompt.trim() !== "" && (
          <button
            type="submit"
            style={{
              ...buttons.submitButton,
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor =
                buttons.submitButtonHover.backgroundColor;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor =
                buttons.submitButton.backgroundColor;
            }}
          >
            <IconTick />
          </button>
        )}
      </div>
    </form>
  );
}
