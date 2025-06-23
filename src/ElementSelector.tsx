"use client";
import React, { useCallback, useRef } from 'react';
import { getMostSpecificElementAtPoint } from './utils';

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
   * Custom filter function for elements
   * Return true to allow selection, false to prevent
   */
  elementFilter?: (element: HTMLElement) => boolean;
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
  elementFilter,
}: ElementSelectorProps) {
  const lastHoveredElement = useRef<HTMLElement | null>(null);

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY } = event;
      
      // Hide the overlay temporarily to get accurate element detection
      const overlayElement = event.currentTarget;
      if (overlayElement) {
        overlayElement.style.pointerEvents = 'none';
      }
      
      // Get element at this point (with overlay hidden)
      const refElement = getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      
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
      
      // Apply custom element filter if provided
      if (elementFilter && !elementFilter(refElement)) {
        return;
      }
      
      // Only trigger callback if the hovered element has changed
      if (lastHoveredElement.current !== refElement) {
        lastHoveredElement.current = refElement;
        onElementHovered(refElement);
      }
    },
    [onElementHovered, ignoreList, excludeSelector, elementFilter]
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
      const clickedElement = getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      
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
      
      // Apply custom element filter if provided
      if (elementFilter && !elementFilter(clickedElement)) {
        return;
      }
      
      // Update last hovered element and trigger selection
      lastHoveredElement.current = clickedElement;
      onElementSelected(clickedElement);
    },
    [onElementSelected, ignoreList, excludeSelector, elementFilter]
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
        cursor: 'cell',
        zIndex: 9999,
        pointerEvents: 'auto',
        ...style,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleMouseClick}
      role="button"
      tabIndex={0}
    />
  );
}
