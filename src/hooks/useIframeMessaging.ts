import { useCallback, useEffect } from 'react';

interface ElementData {
  tagName: string;
  id: string;
  className: string;
  textContent: string | null;
  attributes: Array<{ name: string; value: string }>;
}

/**
 * Custom hook to handle cross-frame communication
 */
export function useIframeMessaging() {
  // Detect if component is inside an iframe
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  
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
  
  return {
    isInIframe,
    sendSelectedElements,
    sendPrompt
  };
}
