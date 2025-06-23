"use client";
import React, { useCallback, useEffect } from 'react';
import { BubbleMenu, InspectionOverlay } from './components';
import {
  useDarkMode,
  useElementBubblePosition,
  useElementSelection,
  useIframeMessaging,
  useInspector
} from './hooks';
import { UI_CONSTANTS } from './constants';

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
  
  /**
   * Whether to show the floating bubble menu button
   * @default false
   */
  showBubbleMenuButton?: boolean;
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
  showBubbleMenuButton = false,
}: ElementInspectorProps) {
  // Custom hooks
  const isDarkMode = useDarkMode();
  const { 
    isInIframe, 
    sendSelectedElements, 
    sendPrompt,
    shouldEnableInspect,
    elementFilter
  } = useIframeMessaging();
  
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
    menuHeight: UI_CONSTANTS.MENU_HEIGHT,
    menuWidth: UI_CONSTANTS.MENU_WIDTH,
    spacing: UI_CONSTANTS.SPACING
  });
  
  // Inspector state hook
  const {
    isInspecting,
    userPrompt,
    setUserPrompt,
    toggleInspection,
    handlePromptSubmit,
  } =  useInspector({
    // Use shouldEnableInspect from iframe messaging if in iframe, otherwise use initialIsActive
    initialIsActive: isInIframe ? shouldEnableInspect : initialIsActive,
    onPromptGenerated: (prompt, elements) => {
      // Send prompt to parent frame if in iframe
      if (isInIframe) {
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
  
  // Update inspection state when shouldEnableInspect changes (from iframe messages)
  useEffect(() => {
    if (isInIframe && isInspecting !== shouldEnableInspect) {
      toggleInspection();
    }
  }, [isInIframe, isInspecting, shouldEnableInspect, toggleInspection]);

  return (
    <div>
      {/* Element Inspector Components */}
      <InspectionOverlay
        isInspecting={isInspecting}
        hoveredElement={hoveredElement}
        selectedElements={selectedElements}
        onElementHovered={handleElementHovered}
        onElementSelected={handleElementSelected}
        onElementUnhovered={handleElementUnhovered}
        excludeSelector={excludeSelector}
        selectorStyle={selectorStyle}
        highlighterStyle={highlighterStyle}
        elementLabel={elementLabel}
        elementFilter={isInIframe ? elementFilter : undefined}
      />

      {/* Bubble Menu */}
      <BubbleMenu
        isInspecting={isInspecting}
        selectedElements={selectedElements}
        bubblePosition={bubblePosition}
        isMenuAboveElement={isMenuAboveElement}
        userPrompt={userPrompt}
        setUserPrompt={setUserPrompt}
        onSubmitPrompt={onSubmitPrompt}
        onToggleInspection={handleMenuToggle}
        isDarkMode={isDarkMode}
        showBubbleMenuButton={showBubbleMenuButton}
      />
    </div>
  );
}
