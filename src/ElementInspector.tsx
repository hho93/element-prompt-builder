"use client";
import React, { useCallback, useState, useEffect } from 'react';
import { ElementHighlighter } from './ElementHighlighter';
import { ElementSelector } from './ElementSelector';
import { createElementsPrompt } from './utils';
import { SquareDashedMousePointer, MousePointer, X, Send } from 'lucide-react';

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
}: ElementInspectorProps) {
  const [isInspecting, setIsInspecting] = useState(initialIsActive);
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<HTMLElement[]>([]);
  const [userPrompt, setUserPrompt] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleElementsSelected = useCallback((elements: HTMLElement[]) => {
    setSelectedElements(elements);
  }, []);

  const onPromptGenerated = useCallback((prompt: string, elements: HTMLElement[]) => {
    console.log('Generated prompt:', prompt);
    
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
      console.log('Sent postMessage to parent window');
    }
  }, []);
  
  const toggleInspection = useCallback(() => {
    setIsInspecting(!isInspecting);
    if (isInspecting) {
      setSelectedElements([]);
    }
  }, [isInspecting]);

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

  const handleElementHovered = useCallback((element: HTMLElement) => {
    setHoveredElement(element);
  }, []);

  const handleElementUnhovered = useCallback(() => {
    setHoveredElement(null);
  }, []);
  
  return (
    <div className="app">
      {/* Element Inspector Component */}
      {isInspecting && (
        <>
          {/* Element selection overlay */}
          <ElementSelector
            onElementHovered={handleElementHovered}
            onElementSelected={(element) => {
              const newSelectedElements = selectedElements.includes(element)
                ? selectedElements.filter(el => el !== element) // Remove if already selected
                : [...selectedElements, element]; // Add if not selected
              
              handleElementsSelected(newSelectedElements);
            }}
            onElementUnhovered={handleElementUnhovered}
            ignoreList={selectedElements}
            excludeSelector={excludeSelector}
            style={selectorStyle}
            useBasicSelection={false}
            selectionModeToggleKey="Alt"
          />
          
          {/* Highlight for hovered element */}
          {hoveredElement && (
            <ElementHighlighter 
              element={hoveredElement}
              borderColor="rgba(59, 130, 246, 0.8)"
              backgroundColor="rgba(59, 130, 246, 0.2)"
              style={highlighterStyle}
            >
              {elementLabel ? (
                elementLabel(hoveredElement)
              ) : (
                <div className="element-tag-label" style={{
                  position: 'absolute',
                  top: '0.5px',
                  left: '0.5px',
                  backgroundColor: 'rgba(52, 53, 65, 0.8)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '12px',
                  color: 'white',
                  pointerEvents: 'none',
                }}>
                  {hoveredElement.tagName.toLowerCase()}
                </div>
              )}
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
              {elementLabel ? (
                elementLabel(element)
              ) : (
                <div className="element-tag-label" style={{
                  position: 'absolute',
                  top: '0.5px',
                  left: '0.5px',
                  backgroundColor: 'rgba(52, 53, 65, 0.8)',
                  borderRadius: '4px',
                  padding: '2px 6px',
                  fontSize: '12px',
                  color: 'white',
                  pointerEvents: 'none',
                }}>
                  {element.tagName.toLowerCase()}
                </div>
              )}
            </ElementHighlighter>
          ))}
        </>
      )}

      {/* Bubble Menu */}
      <div className="fixed bottom-6 right-6 z-[9999] element-inspector-bubble element-inspector-controls">
        {/* Main Menu Button */}
        <button
          onClick={handleMenuToggle}
          className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 element-inspector-controls"
          title="Element Inspector"
        >
          {isMenuOpen ? (
            <X size={20} />
          ) : (
            <SquareDashedMousePointer size={20} />
          )}
        </button>

        {/* Expanded Menu */}
        {(isMenuOpen || isInspecting) && (
          <div className="absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-[350px] transition-all duration-200 element-inspector-controls">
            {/* Header with Close Button */}
            <div className="flex justify-between items-center mb-3 element-inspector-controls">
              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200">Element Inspector</h3>
              <button 
                onClick={handleMenuToggle}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 element-inspector-controls"
                aria-label="Close menu"
              >
                <X size={16} />
              </button>
            </div>
          
            {/* Inspector Toggle */}
            <div className="mb-4 flex items-center justify-between element-inspector-controls">
              <div className="flex items-center gap-2 element-inspector-controls">
                <MousePointer size={18} className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Inspection Mode
                </span>
              </div>
              <div className="flex items-center gap-2">
                {selectedElements.length > 0 && (
                  <span className="text-xs font-medium text-green-600 dark:text-green-400">
                    {selectedElements.length} selected
                  </span>
                )}
                <button
                  onClick={toggleInspection}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors element-inspector-controls ${
                    isInspecting 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                  }`}
                >
                  {isInspecting ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
            
            {/* Prompt Input */}
            <form onSubmit={handlePromptSubmit} className="mt-3 element-inspector-controls">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 element-inspector-controls">
                Prompt
              </label>
              <div className="flex element-inspector-controls">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  className={`flex-1 p-2 text-sm border ${
                    selectedElements.length > 0 
                      ? 'border-green-300 dark:border-green-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-l-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 element-inspector-controls`}
                  placeholder={selectedElements.length > 0 
                    ? `Enter prompt for ${selectedElements.length} selected element(s)` 
                    : "Select elements first"}
                />
                <button
                  type="submit"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md transition-colors element-inspector-controls"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
