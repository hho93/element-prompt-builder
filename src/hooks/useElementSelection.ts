import { useState, useCallback, useEffect } from 'react';

interface UseElementSelectionProps {
  /**
   * Callback when elements are selected
   */
  onElementsSelected?: (elements: HTMLElement[]) => void;
}

/**
 * Custom hook to manage element selection and hovering
 */
export function useElementSelection({ onElementsSelected }: UseElementSelectionProps = {}) {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  const [selectedElements, setSelectedElements] = useState<HTMLElement[]>([]);

  // Element hover handlers
  const handleElementHovered = useCallback((element: HTMLElement) => {
    setHoveredElement(element);
  }, []);

  const handleElementUnhovered = useCallback(() => {
    setHoveredElement(null);
  }, []);

  // Element selection handler
  const handleElementSelected = useCallback((element: HTMLElement) => {
    const isElementSelected = selectedElements.includes(element);
    
    // If element is already selected, remove it
    if (isElementSelected) {
      // Remove data attribute
      element.removeAttribute('data-element-inspector-selected');
      
      const newSelectedElements = selectedElements.filter(el => el !== element);
      setSelectedElements(newSelectedElements);
      onElementsSelected?.(newSelectedElements);
    } 
    // If element is not selected, unselect old elements and select only this one
    else {
      // Remove data attribute from previously selected elements
      selectedElements.forEach(el => {
        el.removeAttribute('data-element-inspector-selected');
      });
      
      // Add data attribute to newly selected element
      element.setAttribute('data-element-inspector-selected', 'true');
      
      const newSelectedElements = [element];
      setSelectedElements(newSelectedElements);
      onElementsSelected?.(newSelectedElements);
    }
  }, [selectedElements, onElementsSelected]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    // Remove data attributes from currently selected elements
    selectedElements.forEach(element => {
      element.removeAttribute('data-element-inspector-selected');
    });
    
    setSelectedElements([]);
    onElementsSelected?.([]);
  }, [selectedElements, onElementsSelected]);

  // Listen for the clearElementSelections event
  useEffect(() => {
    const handleClearSelections = () => {
      clearSelections();
    };

    document.addEventListener('clearElementSelections', handleClearSelections);
    
    return () => {
      document.removeEventListener('clearElementSelections', handleClearSelections);
    };
  }, [clearSelections]);

  // Clean up data attributes when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup data attributes
      selectedElements.forEach(element => {
        element.removeAttribute('data-element-inspector-selected');
      });
    };
  }, [selectedElements]);

  return {
    hoveredElement,
    selectedElements,
    handleElementHovered,
    handleElementUnhovered,
    handleElementSelected,
    clearSelections
  };
}
