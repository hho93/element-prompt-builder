"use client";
import { buttons, darkMode, inputs } from "./base-styles";

/**
 * Styles for the prompt form container
 */
export const formContainerStyles = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
    width: "100%",
  } as React.CSSProperties,
  
  inputWrapper: {
    display: 'flex',
    alignItems: 'center',
    position: 'relative',
    gap: '5px',
    width: '100%' 
  } as React.CSSProperties
};

/**
 * Get styles for the prompt textarea
 */
export const getPromptTextareaStyles = (isDarkMode: boolean, selectedElementsCount: number) => {
  return {
    textarea: {
      ...inputs.promptInput,
      ...(isDarkMode ? darkMode.promptInput : {}),
      ...(selectedElementsCount > 0 ? inputs.promptInputSelected : {}),
      resize: "none",
      minHeight: "62px", // Height for approximately 3 lines
      lineHeight: "1.5",
    } as React.CSSProperties
  };
};

/**
 * Styles for the submit button
 */
export const submitButtonStyles = {
  button: {
    ...buttons.submitButton,
    borderRadius: "50%",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  } as React.CSSProperties,
  
  hoverBackgroundColor: buttons.submitButtonHover.backgroundColor as string,
  normalBackgroundColor: buttons.submitButton.backgroundColor as string
};
