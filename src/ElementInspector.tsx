"use client";
import React, { useCallback } from 'react';
import { BubbleMenuButton, ElementTagLabel, PromptForm } from './components/';
import { ElementHighlighter } from './ElementHighlighter';
import { ElementSelector } from './ElementSelector';
import { darkMode, elements, layout } from './styles';
import {
  useDarkMode,
  useElementBubblePosition,
  useElementSelection,
  useIframeMessaging,
  useInspector
} from './hooks';

export interface ElementInspectorProps {
  /**
   * Initial state of the inspector (active or not)
   */
  initialIsActive?: boolean;
  
  /**
   * CSS selector for elements to exclude from selection
   */
  excludeSelector?: string;
  
  /**
   * Custom label for selected elements
   */
  elementLabel?: (element: HTMLElement) => React.ReactNode;
  
  /**
   * Custom styles for the selector
   */
  selectorStyle?: React.CSSProperties;
  
  /**
   * Custom styles for the highlighter
   */
  highlighterStyle?: React.CSSProperties;
}

/**
 * A component that allows inspecting and selecting DOM elements with a UI for interaction
 */
export function ElementInspector({
  initialIsActive = true,
  excludeSelector = '.element-inspector-bubble, .element-inspector-controls',
  elementLabel,
  selectorStyle,
  highlighterStyle,
}: ElementInspectorProps) {
  // Custom hooks
  const isDarkMode = useDarkMode();
  const { isInIframe, sendSelectedElements, sendPrompt } = useIframeMessaging();
  
  // Element selection hook
  const { 
    hoveredElement, 
    selectedElements, 
    handleElementHovered, 
    handleElementUnhovered, 
    handleElementSelected,
    clearSelections 
  } = useElementSelection({
    onElementsSelected: (elements) => {
      // Send selected elements to parent frame if in iframe
      if (isInIframe) {
        sendSelectedElements(elements);
      }
    }
  });
  
  // Bubble position hook
  const { bubblePosition, isMenuAboveElement } = useElementBubblePosition({
    selectedElements,
    menuHeight: 75,
    menuWidth: 300,
    spacing: 10
  });
  
  // Inspector state hook
  const {
    isInspecting,
    userPrompt,
    setUserPrompt,
    toggleInspection,
    handlePromptSubmit,
  } = useInspector({
    initialIsActive,
    onPromptGenerated: (prompt, elements) => {
      // Send prompt to parent frame if in iframe
      if (1) {
        sendPrompt(prompt, elements);
      }
    }
  });
  
  // Handle menu toggle - clear selections when toggling off
  const handleMenuToggle = useCallback(() => {
    toggleInspection();
    if (isInspecting) {
      clearSelections();
    }
  }, [isInspecting, toggleInspection, clearSelections]);
  
  // Handle form submission with selected elements
  const onSubmitPrompt = useCallback((e: React.FormEvent) => {
    handlePromptSubmit(e, selectedElements);
  }, [handlePromptSubmit, selectedElements]);
  
  // Element selector props
  const elementSelectorProps = {
    onElementHovered: handleElementHovered,
    onElementSelected: handleElementSelected,
    onElementUnhovered: handleElementUnhovered,
    ignoreList: selectedElements,
    excludeSelector,
    style: selectorStyle,
  };

  return (
    <div>
      {/* Element Inspector Component */}
      {isInspecting && (
        <>
          {/* Element selection overlay */}
          <ElementSelector {...elementSelectorProps} />
          
          {/* Highlight for hovered element */}
          {hoveredElement && (
            <ElementHighlighter 
              element={hoveredElement}
              borderColor="rgba(59, 130, 246, 0.8)"
              backgroundColor="rgba(59, 130, 246, 0.2)"
              style={highlighterStyle}
            >
              {elementLabel ? elementLabel(hoveredElement) : <ElementTagLabel element={hoveredElement} />}
            </ElementHighlighter>
          )}
          
          {/* Highlights for selected elements */}
          {selectedElements.map((element, index) => (
            <ElementHighlighter
              key={`selected-${index}`}
              element={element}
              borderColor="rgba(34, 197, 94, 0.8)"
              backgroundColor="rgba(34, 197, 94, 0.2)"
              style={highlighterStyle}
            >
              {elementLabel ? elementLabel(element) : <ElementTagLabel element={element} />}
            </ElementHighlighter>
          ))}
        </>
      )}

      {/* Bubble Menu */}
      <div 
        className="element-inspector-bubble"
        style={{
          ...layout.bubble,
          position: 'static', // The container doesn't need positioning
        }}
      >
        {/* Expanded Menu - Only Prompt Form */}
        {isInspecting && selectedElements.length > 0 && (
          <>
            {/* Position indicator arrow */}
            <div
              style={{
                ...elements.menuArrow,
                top: isMenuAboveElement 
                  ? `${bubblePosition.top + 75}px` // Arrow at bottom of menu
                  : `${bubblePosition.top - 8}px`,  // Arrow at top of menu
                left: `${bubblePosition.left + bubblePosition.arrowOffset}px`,
                borderTop: isMenuAboveElement ? `8px solid ${isDarkMode ? '#1f2937' : 'white'}` : 'none',
                borderBottom: isMenuAboveElement ? 'none' : `8px solid ${isDarkMode ? '#1f2937' : 'white'}`,
                pointerEvents: 'none',
                opacity: selectedElements.length > 0 ? 1 : 0,
              }}
              aria-hidden="true"
            />
            <div 
              className="element-inspector-controls"
              style={{
                ...layout.expandedMenu,
                ...(isDarkMode ? darkMode.expandedMenu : {}),
                padding: '16px',
                position: 'fixed',
                top: `${bubblePosition.top}px`,
                left: `${bubblePosition.left}px`,
                zIndex: 10000,
                maxHeight: '400px',
                overflowY: 'auto',
              }}
            >
              {/* Prompt Input */}
              <PromptForm
                userPrompt={userPrompt}
                setUserPrompt={setUserPrompt}
                handlePromptSubmit={onSubmitPrompt}
                selectedElementsCount={selectedElements.length}
                isDarkMode={isDarkMode}
              />
            </div>
          </>
        )}

        {/* Main Menu Button Container - Always at bottom right */}
        <div style={{ 
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 10000,
        }}>
          <BubbleMenuButton 
            isInspecting={isInspecting} 
            onClick={handleMenuToggle} 
          />
        </div>
      </div>
    </div>
  );
}
