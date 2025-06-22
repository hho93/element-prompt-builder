import { useState, useCallback, useEffect } from 'react';
import { createElementsPrompt } from '../utils';

interface UseInspectorProps {
  initialIsActive?: boolean;
  onPromptGenerated?: (prompt: string, elements: HTMLElement[]) => void;
}

/**
 * Custom hook to manage the inspector state and prompt generation
 */
export function useInspector({
  initialIsActive = true,
  onPromptGenerated
}: UseInspectorProps = {}) {
  const [isInspecting, setIsInspecting] = useState(initialIsActive);
  const [userPrompt, setUserPrompt] = useState('');
  
  // Toggle inspection mode
  const toggleInspection = useCallback(() => {
    setIsInspecting(prev => !prev);
  }, []);
  
  // Handle ESC key to exit inspection mode
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
  
  // Generate prompt from selected elements and user input
  const generatePrompt = useCallback((elements: HTMLElement[], prompt: string) => {
    if (elements.length === 0 || !prompt.trim()) return;
    
    const generatedPrompt = createElementsPrompt(elements, prompt);
    
    // Dispatch custom event for local handlers
    const promptEvent = new CustomEvent('promptGenerated', {
      detail: { prompt: generatedPrompt, elements }
    });
    document.dispatchEvent(promptEvent);
    
    // Call the callback if provided
    onPromptGenerated?.(generatedPrompt, elements);
    
    // Clear the prompt input
    setUserPrompt('');
  }, [onPromptGenerated]);
  
  // Handle form submission
  const handlePromptSubmit = useCallback((e: React.FormEvent, elements: HTMLElement[]) => {
    e.preventDefault();
    generatePrompt(elements, userPrompt);
  }, [userPrompt, generatePrompt]);
  
  return {
    isInspecting,
    userPrompt,
    setUserPrompt,
    toggleInspection,
    handlePromptSubmit,
    generatePrompt
  };
}
