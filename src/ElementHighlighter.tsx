"use client";
import React, { useCallback, useEffect, useRef } from 'react';

export interface ElementHighlighterProps {
  /**
   * The element to highlight
   */
  element: HTMLElement;
  
  /**
   * CSS class for the highlighter
   */
  className?: string;
  
  /**
   * Custom styles for the highlighter
   */
  style?: React.CSSProperties;
  
  /**
   * Update rate in frames per second (0 to disable updates)
   */
  updateRate?: number;
  
  /**
   * Content to render inside the highlighter
   */
  children?: React.ReactNode;
  
  /**
   * Border color for the highlighter
   */
  borderColor?: string;
  
  /**
   * Background color for the highlighter
   */
  backgroundColor?: string;
}

/**
 * A component that highlights a DOM element with a border
 */
export function ElementHighlighter({
  element,
  className = '',
  style = {},
  updateRate = 30,
  children,
  borderColor = 'rgba(59, 130, 246, 0.8)',
  backgroundColor = 'rgba(59, 130, 246, 0.2)',
}: ElementHighlighterProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const updateIntervalRef = useRef<number | null>(null);

  const updateBoxPosition = useCallback(() => {
    if (boxRef.current && element) {
      const referenceRect = element.getBoundingClientRect();

      boxRef.current.style.top = `${referenceRect.top - 2}px`;
      boxRef.current.style.left = `${referenceRect.left - 2}px`;
      boxRef.current.style.width = `${referenceRect.width + 4}px`;
      boxRef.current.style.height = `${referenceRect.height + 4}px`;
    }
  }, [element]);

  // Set up the interval for updating the box position
  useEffect(() => {
    updateBoxPosition();
    
    if (updateRate > 0) {
      const intervalId = window.setInterval(() => {
        updateBoxPosition();
      }, 1000 / updateRate);
      
      updateIntervalRef.current = intervalId;
      
      return () => {
        if (updateIntervalRef.current !== null) {
          window.clearInterval(updateIntervalRef.current);
        }
      };
    }
  }, [updateBoxPosition, updateRate]);

  // Also update on window resize
  useEffect(() => {
    const handleResize = () => {
      updateBoxPosition();
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [updateBoxPosition]);

  return (
    <div
      className={`element-highlighter ${className}`}
      style={{
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '4px',
        border: `2px solid ${borderColor}`,
        backgroundColor,
        transition: 'all 100ms',
        zIndex: 9998,
        pointerEvents: 'none',
        ...style,
      }}
      ref={boxRef}
    >
      {children}
    </div>
  );
}
