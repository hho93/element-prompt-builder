import { useState, useEffect } from 'react';

interface BubblePosition {
  top: number;
  left: number;
  arrowOffset: number;
}

interface UseElementBubblePositionProps {
  selectedElements: HTMLElement[];
  menuHeight?: number;
  menuWidth?: number;
  spacing?: number;
}

/**
 * Custom hook to calculate and update the position of a bubble menu
 * relative to selected elements
 */
export function useElementBubblePosition({
  selectedElements,
  menuHeight = 75,
  menuWidth = 300,
  spacing = 10,
}: UseElementBubblePositionProps) {
  const [bubblePosition, setBubblePosition] = useState<BubblePosition>({ top: 0, left: 0, arrowOffset: 20 });
  const [isMenuAboveElement, setIsMenuAboveElement] = useState(false);
  
  // Calculate and update bubble position based on selected elements
  useEffect(() => {
    if (selectedElements.length === 0) return;
    
    const updateBubblePosition = () => {
      const lastElement = selectedElements[selectedElements.length - 1];
      const rect = lastElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Calculate element center point for arrow positioning
      const elementCenterX = rect.left + (rect.width / 2);
      
      // Check if element is near the bottom of the viewport
      const isNearBottom = (rect.bottom + menuHeight + spacing * 2 > viewportHeight);
      
      // Update state to indicate menu position
      setIsMenuAboveElement(isNearBottom);
      
      // Position calculations - below or above the element based on position
      let top = isNearBottom 
        ? rect.top + window.scrollY - menuHeight - spacing // spacing above the element
        : rect.bottom + window.scrollY + spacing; // spacing below the element
        
      // Initialize left position - try to center the menu on the element if possible
      let left = rect.left + (rect.width / 2) - (menuWidth / 2) + window.scrollX;
      
      // Special case for elements very close to the bottom of the page
      if (isNearBottom && rect.top < menuHeight + spacing * 2) {
        // If there's not enough space above or below, position beside the element
        const spaceRight = viewportWidth - rect.right;
        if (spaceRight >= menuWidth + spacing * 2) {
          // Place to the right
          top = rect.top + window.scrollY;
          left = rect.right + window.scrollX + spacing;
        } else {
          // As a last resort, position at top of page with enough space for scrolling
          top = window.scrollY + spacing;
        }
      }
      
      // Ensure the bubble stays within viewport bounds horizontally
      left = Math.max(spacing, Math.min(left, viewportWidth - menuWidth - spacing));
      
      // Calculate arrow position relative to the menu - should point to element center
      const arrowOffset = elementCenterX - left - window.scrollX;
      
      // Ensure the bubble stays within viewport bounds vertically
      top = Math.max(spacing, top);
      
      setBubblePosition({ 
        top, 
        left, 
        // Keep arrow within menu bounds (spacing*2 to width-spacing*2)
        arrowOffset: Math.min(Math.max(spacing * 2, arrowOffset), menuWidth - spacing * 2)
      });
    };
    
    // Initial calculation
    updateBubblePosition();
    
    // Re-calculate on window resize or scroll
    window.addEventListener('resize', updateBubblePosition);
    window.addEventListener('scroll', updateBubblePosition);
    
    return () => {
      window.removeEventListener('resize', updateBubblePosition);
      window.removeEventListener('scroll', updateBubblePosition);
    };
  }, [selectedElements, menuHeight, menuWidth, spacing]);
  
  return { bubblePosition, isMenuAboveElement };
}
