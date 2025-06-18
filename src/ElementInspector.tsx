"use client";
import React, { useCallback, useState, useEffect } from 'react';
import { ElementHighlighter } from './ElementHighlighter';
import { ElementSelector } from './ElementSelector';
import { createElementsPrompt } from './utils';
import { IconX } from './Icons';
import { layout, buttons, text, darkMode } from './styles';
import { ElementTagLabel, BubbleMenuButton, InspectorToggle, PromptForm } from './components';

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
   * Maximum number of elements that can be selected
   */
  maxElements?: number;
  
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
  initialIsActive = false,
  excludeSelector = '.element-inspector-bubble, .element-inspector-controls',
  elementLabel,
  selectorStyle,
  highlighterStyle,
  maxElements = 5,
}: ElementInspectorProps) {
  // State hooks
  const [isInspecting, setIsInspecting] = useState(initialIsActive);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<HTMLElement[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  // Check for dark mode on component mount
  useEffect(() => {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(isDark);
    
    // Listen for changes in color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Element selection handlers
  const handleElementsSelected = useCallback((elements: HTMLElement[]) => {
    setSelectedElements(elements);
  }, []);

  const handleElementHovered = useCallback((element: HTMLElement) => {
    setHoveredElement(element);
  }, []);

  const handleElementUnhovered = useCallback(() => {
    setHoveredElement(null);
  }, []);
  
  // Prompt generation handler
  const onPromptGenerated = useCallback((prompt: string, elements: HTMLElement[]) => {
    // Create a custom event for local handlers
    const promptEvent = new CustomEvent('promptGenerated', {
      detail: { prompt, elements }
    });
    document.dispatchEvent(promptEvent);
    
    // Check if component is inside an iframe by comparing window and parent
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      // Send a postMessage to the parent window
      window.parent.postMessage({
        type: 'ELEMENT_INSPECTOR_PROMPT',
        payload: {
          prompt,
          elements: elements.map(el => ({
            tagName: el.tagName,
            id: el.id,
            className: el.className,
            textContent: el.textContent?.trim(),
            attributes: Array.from(el.attributes).map(attr => ({
              name: attr.name,
              value: attr.value
            }))
          }))
        }
      }, '*');
    }
  }, []);
  
  // UI interaction handlers
  const toggleInspection = useCallback(() => {
    setIsInspecting(!isInspecting);
    if (isInspecting) {
      setSelectedElements([]);
    }
  }, [isInspecting]);

  const handleMenuToggle = useCallback(() => {
    setIsMenuOpen(!isMenuOpen);
    setIsInspecting(!isMenuOpen);
  }, [isMenuOpen]);

  const handlePromptSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedElements.length > 0 && userPrompt) {
      // Generate the prompt based on selected elements and user input
      const prompt = createElementsPrompt(
        selectedElements,
        userPrompt,
      );
      
      // Call the onPromptGenerated callback
      onPromptGenerated(prompt, selectedElements);
      
      // Clear the input field after submission
      setUserPrompt('');
    }
  }, [selectedElements, userPrompt, onPromptGenerated]);

  // Handle escape key to exit inspection mode
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isInspecting) {
        setIsInspecting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isInspecting]);
  
  const elementSelectorProps = {
    onElementHovered: handleElementHovered,
    onElementSelected: (element: HTMLElement) => {
      const isElementSelected = selectedElements.includes(element);
      
      // If element is already selected, remove it
      if (isElementSelected) {
        const newSelectedElements = selectedElements.filter(el => el !== element);
        handleElementsSelected(newSelectedElements);
      } 
      // If element is not selected and we haven't reached max limit, add it
      else if (selectedElements.length < maxElements) {
        const newSelectedElements = [...selectedElements, element];
        handleElementsSelected(newSelectedElements);
      }
      // If we've reached the limit and trying to add another element, don't add it
      // Could add a visual feedback here if needed
    },
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
        className="element-inspector-bubble element-inspector-controls"
        style={layout.bubble}
      >
        {/* Main Menu Button */}
        <BubbleMenuButton isOpen={isMenuOpen} onClick={handleMenuToggle} />

        {/* Expanded Menu */}
        {(isMenuOpen || isInspecting) && (
          <div 
            className="element-inspector-controls"
            style={{
              ...layout.expandedMenu,
              ...(isDarkMode ? darkMode.expandedMenu : {})
            }}
          >
            {/* Header with Close Button */}
            <div 
              className="element-inspector-controls"
              style={layout.menuHeader}
            >
              <h3 
                style={{
                  ...text.menuTitle,
                  ...(isDarkMode ? darkMode.menuTitle : {})
                }}
              >
                Element Inspector
              </h3>
              <button 
                onClick={handleMenuToggle}
                style={{
                  ...buttons.closeButton,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.color = isDarkMode 
                    ? darkMode.closeButtonHover.color 
                    : buttons.closeButtonHover.color;
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.color = buttons.closeButton.color;
                }}
                aria-label="Close menu"
                className="element-inspector-controls"
              >
                <IconX />
              </button>
            </div>
          
            {/* Inspector Toggle */}
            <InspectorToggle 
              isInspecting={isInspecting}
              selectedCount={selectedElements.length}
              toggleInspection={toggleInspection}
              isDarkMode={isDarkMode}
              maxElements={maxElements}
            />
            
            {/* Prompt Input */}
            <PromptForm
              userPrompt={userPrompt}
              setUserPrompt={setUserPrompt}
              handlePromptSubmit={handlePromptSubmit}
              selectedElementsCount={selectedElements.length}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
      </div>
    </div>
  );
}
