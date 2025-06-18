import React from 'react';
import { elements } from './styles';
import { IconPointer, IconSquareDashedPointer, IconX, IconSend } from './Icons';
import { layout, buttons, text, inputs, states, darkMode } from './styles';

// Element Tag Label component
export const ElementTagLabel = ({ element }: { element: HTMLElement }) => (
  <div style={elements.elementTagLabel}>
    {element.tagName.toLowerCase()}
  </div>
);

// Bubble Menu Button component
export const BubbleMenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <button
    onClick={onClick}
    style={buttons.mainButton}
    onMouseOver={(e) => {
      e.currentTarget.style.backgroundColor = buttons.mainButtonHover.backgroundColor;
    }}
    onMouseOut={(e) => {
      e.currentTarget.style.backgroundColor = buttons.mainButton.backgroundColor;
    }}
    title="Element Inspector"
    className="element-inspector-controls"
  >
    {isOpen ? <IconX /> : <IconSquareDashedPointer />}
  </button>
);

// Inspector Toggle component
export const InspectorToggle = ({ 
  isInspecting, 
  selectedCount, 
  toggleInspection,
  isDarkMode,
  maxElements = 5 
}: { 
  isInspecting: boolean; 
  selectedCount: number;
  toggleInspection: () => void;
  isDarkMode: boolean;
  maxElements?: number;
}) => (
  <div 
    className="element-inspector-controls"
    style={layout.inspectorToggle}
  >
    <div 
      className="element-inspector-controls"
      style={layout.toggleLeft}
    >
      <IconPointer />
      <span 
        style={{
          ...text.toggleText,
          ...(isDarkMode ? darkMode.toggleText : {})
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
            ...(isDarkMode ? darkMode.selectedCount : {})
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
            ? (isDarkMode ? {...darkMode.toggleButtonActive} : {...states.toggleButtonActive})
            : (isDarkMode ? {...darkMode.toggleButtonInactive} : {...states.toggleButtonInactive})
          )
        }}
        className="element-inspector-controls"
      >
        {isInspecting ? 'Active' : 'Inactive'}
      </button>
    </div>
  </div>
);

// Prompt Form component
export const PromptForm = ({ 
  userPrompt, 
  setUserPrompt, 
  handlePromptSubmit, 
  selectedElementsCount,
  isDarkMode 
}: { 
  userPrompt: string; 
  setUserPrompt: (value: string) => void;
  handlePromptSubmit: (e: React.FormEvent) => void;
  selectedElementsCount: number;
  isDarkMode: boolean;
}) => (
  <form 
    onSubmit={handlePromptSubmit} 
    style={layout.promptForm}
    className="element-inspector-controls"
  >
    <label 
      style={{
        ...text.promptLabel,
        ...(isDarkMode ? darkMode.promptLabel : {})
      }}
      className="element-inspector-controls"
    >
      Prompt
    </label>
    <div 
      style={layout.inputContainer}
      className="element-inspector-controls"
    >
      <input
        type="text"
        value={userPrompt}
        onChange={(e) => setUserPrompt(e.target.value)}
        style={{
          ...inputs.promptInput,
          ...(isDarkMode ? darkMode.promptInput : {}),
          ...(selectedElementsCount > 0 ? inputs.promptInputSelected : {})
        }}
        onFocus={(e) => {
          e.currentTarget.style.boxShadow = inputs.promptInputFocus.boxShadow;
          e.currentTarget.style.borderColor = inputs.promptInputFocus.borderColor;
        }}
        onBlur={(e) => {
          e.currentTarget.style.boxShadow = 'none';
          e.currentTarget.style.borderColor = selectedElementsCount > 0 
            ? inputs.promptInputSelected.borderColor 
            : isDarkMode ? darkMode.promptInput.borderColor : inputs.promptInput.borderColor;
        }}
        placeholder={selectedElementsCount > 0 
          ? `Enter prompt for ${selectedElementsCount} selected element(s)` 
          : "Select elements first"}
        className="element-inspector-controls"
      />
      <button
        type="submit"
        style={buttons.submitButton}
        onMouseOver={(e) => {
          e.currentTarget.style.backgroundColor = buttons.submitButtonHover.backgroundColor;
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.backgroundColor = buttons.submitButton.backgroundColor;
        }}
        className="element-inspector-controls"
      >
        <IconSend />
      </button>
    </div>
  </form>
);
