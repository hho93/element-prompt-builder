import { useCallback, useEffect, useState } from 'react';
import { useAuthStore } from "../stores/auth";

type TabType = 'chat' | 'design' | 'workflow' | null;

/**
 * Extracts common properties from an HTML element
 */
const extractElementProperties = (el: HTMLElement) => ({
  tagName: el.tagName,
  id: el.id,
  className: el.className,
  textContent: el.textContent?.trim(),
  attributes: Array.from(el.attributes).map(attr => ({
    name: attr.name,
    value: attr.value
  }))
});

/**
 * Maps an HTML element to a serializable object representation
 */
const mapElementToObject = (el: HTMLElement) => {
  // Find all form elements inside this element
  const formElements = Array.from(el.querySelectorAll('input, textarea, select'))
    .filter(formEl => formEl instanceof HTMLElement)
    .map((formEl: HTMLElement) => extractElementProperties(formEl));
    
  return {
    ...extractElementProperties(el),
    childrens: formElements
  };
};

/**
 * Custom hook to handle cross-frame communication
 */
export function useIframeMessaging() {
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const [activeTab, setActiveTab] = useState<TabType>(null);
  const [shouldEnableInspect, setShouldEnableInspect] = useState<boolean>(!isInIframe);
  
  // Effect to listen for messages from the parent window
  useEffect(() => {
    if (!isInIframe) return;
    
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'TAB_CHANGED') {
        const { activeTab: newActiveTab } = event.data.payload || {};
        
        setActiveTab(newActiveTab as TabType);
        
        // Disable inspect mode for chat tab
        if (newActiveTab === 'chat') {
          setShouldEnableInspect(false);
        }
        // Enable inspect mode for design and workflow tabs
        else if (newActiveTab === 'design' || newActiveTab === 'workflow') {
          setShouldEnableInspect(true);
        }
      } else if (event.data?.type === 'ACCESS_TOKEN') {
        useAuthStore.getState().setAccessToken(event.data.payload.token);
      }
    };
    
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };  }, [isInIframe, activeTab]);

  // Send selected elements to parent window
  const sendSelectedElements = useCallback((elements: HTMLElement[]) => {
    if (!isInIframe) return;
    
    window.parent.postMessage({
      type: 'ELEMENT_INSPECTOR_SELECTED',
      payload: {
        elements: elements.map(el => mapElementToObject(el))
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
        elements: elements.map(mapElementToObject)
      }
    }, '*');
  }, [isInIframe, activeTab]);
  
  return {
    isInIframe,
    sendSelectedElements,
    sendPrompt,
    activeTab,
    shouldEnableInspect
  };
}
