import { useCallback, useEffect, useState } from 'react';

type TabType = 'chat' | 'design' | 'workflow' | null;

/**
 * Custom hook to handle cross-frame communication
 */
export function useIframeMessaging() {
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [shouldEnableInspect, setShouldEnableInspect] = useState<boolean>(!isInIframe);
  const [onlySelectButtons, setOnlySelectButtons] = useState<boolean>(false);
  
  // Effect to listen for messages from the parent window
  useEffect(() => {
    if (!isInIframe) return;
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TAB_CHANGED') {
        const { activeTab: newActiveTab } = event.data.payload || {};
        const previousTab = activeTab;
        
        setActiveTab(newActiveTab as TabType);
        
        // Disable inspect mode for chat tab
        if (newActiveTab === 'chat') {
          setShouldEnableInspect(false);
        }
        // Enable inspect mode for design and workflow tabs
        else if (newActiveTab === 'design' || newActiveTab === 'workflow') {
          setShouldEnableInspect(true);
          // Only allow button selection in workflow tab
          const isWorkflowTab = newActiveTab === 'workflow';
          setOnlySelectButtons(isWorkflowTab);
          
          // If switching to workflow tab, unselect any currently selected non-button elements
          if (isWorkflowTab && previousTab !== 'workflow' && document.querySelectorAll('[data-element-inspector-selected="true"]').length > 0) {
            // Check if any selected elements are not buttons
            const selectedElements = Array.from(document.querySelectorAll('[data-element-inspector-selected="true"]')) as HTMLElement[];
            const hasNonButtonSelected = selectedElements.some(element => !isButtonElement(element));
            
            // If any non-button elements are selected, trigger a clear selection event
            if (hasNonButtonSelected) {
              // Dispatch a custom event that can be listened for in useElementSelection
              document.dispatchEvent(new CustomEvent('clearElementSelections'));
            }
          }
        }
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [isInIframe, activeTab]);
  
  // Helper function to check if an element is a button
  const isButtonElement = useCallback((element: HTMLElement): boolean => {
    // Check if element is a button or has button-like characteristics
    const isButtonElement = element.tagName.toLowerCase() === 'button';
    const hasButtonRole = element.getAttribute('role') === 'button';
    const hasButtonType = element.getAttribute('type') === 'button' || 
                         element.getAttribute('type') === 'submit' || 
                         element.getAttribute('type') === 'reset';
    
    // Check for common button class names
    const classNames = element.className.toLowerCase();
    const hasButtonClass = classNames.includes('btn') || 
                         classNames.includes('button') ||
                         classNames.includes('-btn-') ||
                         classNames.includes('submit') ||
                         classNames.includes('action');
    
    // Check for clickable elements with pointer cursor
    const computedStyle = window.getComputedStyle(element);
    const hasCursorPointer = computedStyle.cursor === 'pointer';
    
    // Check for elements with event listeners (approximation)
    const hasOnClickAttr = element.hasAttribute('onclick') || element.hasAttribute('ng-click') || element.hasAttribute('@click');
    
    // If any of these conditions are met, consider it a button
    return isButtonElement || hasButtonRole || hasButtonType || hasButtonClass || (hasCursorPointer && hasOnClickAttr);
  }, []);
  
  // Element filter function based on active tab
  const elementFilter = useCallback((element: HTMLElement): boolean => {
    // If in workflow tab, only allow button elements
    if (onlySelectButtons) {
      return isButtonElement(element);
    }
    // Otherwise allow all elements
    return true;
  }, [onlySelectButtons, isButtonElement]);
  
  // Send selected elements to parent window
  const sendSelectedElements = useCallback((elements: HTMLElement[]) => {
    if (!isInIframe) return;
    
    window.parent.postMessage({
      type: 'ELEMENT_INSPECTOR_SELECTED',
      payload: {
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
  }, [isInIframe]);
  
  // Send generated prompt to parent window
  const sendPrompt = useCallback((prompt: string, elements: HTMLElement[]) => {
    if (!isInIframe) return;
    
    window.parent.postMessage({
      type: 'ELEMENT_INSPECTOR_PROMPT',
      payload: {
        prompt,
        activeTab,
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
  }, [isInIframe, activeTab]);
  
  return {
    isInIframe,
    sendSelectedElements,
    sendPrompt,
    activeTab,
    shouldEnableInspect,
    elementFilter,
    onlySelectButtons
  };
}
