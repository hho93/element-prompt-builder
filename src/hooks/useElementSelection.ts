import { useState, useCallback } from 'react';

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
      const newSelectedElements = selectedElements.filter(el => el !== element);
      setSelectedElements(newSelectedElements);
      onElementsSelected?.(newSelectedElements);
    } 
    // If element is not selected, unselect old elements and select only this one
    else {
      const newSelectedElements = [element];
      setSelectedElements(newSelectedElements);
      onElementsSelected?.(newSelectedElements);
    }
  }, [selectedElements, onElementsSelected]);

  // Clear all selections
  const clearSelections = useCallback(() => {
    setSelectedElements([]);
    onElementsSelected?.([]);
  }, [onElementsSelected]);

  return {
    hoveredElement,
    selectedElements,
    handleElementHovered,
    handleElementUnhovered,
    handleElementSelected,
    clearSelections
  };
}
