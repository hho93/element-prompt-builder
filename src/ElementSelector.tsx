"use client";
import React, { useCallback, useRef } from 'react';
import { getElementAtPoint, getMostSpecificElementAtPoint } from './utils';

export interface ElementSelectorProps {
  /**
   * Callback when an element is hovered
   */
  onElementHovered: (element: HTMLElement) => void;
  
  /**
   * Callback when an element is no longer hovered
   */
  onElementUnhovered: () => void;
  
  /**
   * Callback when an element is selected
   */
  onElementSelected: (element: HTMLElement) => void;
  
  /**
   * List of elements to ignore during selection
   */
  ignoreList?: HTMLElement[];
  
  /**
   * CSS selector for elements to exclude
   */
  excludeSelector?: string;
  
  /**
   * CSS class name for the selector overlay
   */
  className?: string;
  
  /**
   * Custom styles for the selector overlay
   */
  style?: React.CSSProperties;
  
  /**
   * Whether to use basic selection instead of most specific element selection
   */
  useBasicSelection?: boolean;
  
  /**
   * Key code to toggle basic/advanced selection mode (default: 'Alt')
   */
  selectionModeToggleKey?: string;
}

/**
 * ElementSelector component that creates an overlay to select DOM elements
 */
export function ElementSelector({
  onElementHovered,
  onElementUnhovered,
  onElementSelected,
  ignoreList = [],
  excludeSelector = '',
  className = '',
  style = {},
  useBasicSelection = false,
  selectionModeToggleKey = 'Alt',
}: ElementSelectorProps) {
  const lastHoveredElement = useRef<HTMLElement | null>(null);
  const [isUsingBasicSelection, setIsUsingBasicSelection] = React.useState(useBasicSelection);

  // Handle key down/up for the selection mode toggle
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === selectionModeToggleKey) {
        setIsUsingBasicSelection(true);
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === selectionModeToggleKey) {
        setIsUsingBasicSelection(false);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [selectionModeToggleKey]);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = event;
      
      // Hide the overlay temporarily to get accurate element detection
      const overlayElement = event.currentTarget;
      if (overlayElement) {
        overlayElement.style.pointerEvents = 'none';
      }
      
      // Get element at this point (with overlay hidden)
      const refElement = isUsingBasicSelection 
        ? getElementAtPoint(clientX, clientY, excludeSelector)
        : getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      
      // Restore the overlay
      if (overlayElement) {
        overlayElement.style.pointerEvents = 'auto';
      }
      
      // Ignore if element is in the ignore list
      if (ignoreList.includes(refElement)) return;
      
      // Ignore if element is the overlay itself or a child of it
      if (refElement === overlayElement || 
          (overlayElement && overlayElement.contains(refElement))) {
        return;
      }
      
      // Only trigger callback if the hovered element has changed
      if (lastHoveredElement.current !== refElement) {
        lastHoveredElement.current = refElement;
        onElementHovered(refElement);
      }
    },
    [onElementHovered, ignoreList, excludeSelector, isUsingBasicSelection]
  );

  const handleMouseLeave = useCallback(() => {
    lastHoveredElement.current = null;
    onElementUnhovered();
  }, [onElementUnhovered]);

  const handleMouseClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      // Prevent the default action and stop propagation
      event.preventDefault();
      event.stopPropagation();
      
      const { clientX, clientY } = event;
      
      // Hide the overlay temporarily to get accurate element detection
      const overlayElement = event.currentTarget;
      if (overlayElement) {
        overlayElement.style.pointerEvents = 'none';
      }
      
      // Get the most accurate element at click position
      const clickedElement = isUsingBasicSelection
        ? getElementAtPoint(clientX, clientY, excludeSelector)
        : getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      
      // Restore the overlay
      if (overlayElement) {
        overlayElement.style.pointerEvents = 'auto';
      }
      
      // Don't select if it's the overlay
      if (
        clickedElement === overlayElement || 
        (overlayElement && overlayElement.contains(clickedElement))
      ) {
        return;
      }
      
      // Update last hovered element and trigger selection
      lastHoveredElement.current = clickedElement;
      onElementSelected(clickedElement);
    },
    [onElementSelected, ignoreList, excludeSelector, isUsingBasicSelection]
  );

  return (
    <div
      className={`element-selector ${className}`}
      data-element-selector="true"
      style={{
        position: 'fixed',
        inset: 0,
        height: '100vh',
        width: '100vw',
        cursor: isUsingBasicSelection ? 'crosshair' : 'cell',
        zIndex: 9999,
        pointerEvents: 'auto',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
      role="button"
      tabIndex={0}
    >
      {isUsingBasicSelection && (
        <div style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          padding: '5px 10px',
          borderRadius: '4px',
          fontSize: '12px',
          pointerEvents: 'none'
        }}>
          Basic Selection Mode (Press Alt to toggle)
        </div>
      )}
    </div>
  );
}
