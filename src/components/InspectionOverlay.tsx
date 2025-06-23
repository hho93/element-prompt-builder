"use client";
import React from 'react';
import { ElementSelector } from '../ElementSelector';
import { HoveredElement } from './highlights/HoveredElement';
import { SelectedElements } from './highlights/SelectedElements';

interface InspectionOverlayProps {
  isInspecting: boolean;
  hoveredElement: HTMLElement | null;
  selectedElements: HTMLElement[];
  onElementHovered: (element: HTMLElement) => void;
  onElementSelected: (element: HTMLElement) => void;
  onElementUnhovered: () => void;
  excludeSelector: string;
  selectorStyle?: React.CSSProperties;
  highlighterStyle?: React.CSSProperties;
  elementLabel?: (element: HTMLElement) => React.ReactNode;
  elementFilter?: (element: HTMLElement) => boolean;
}

export const InspectionOverlay: React.FC<InspectionOverlayProps> = ({
  isInspecting,
  hoveredElement,
  selectedElements,
  onElementHovered,
  onElementSelected,
  onElementUnhovered,
  excludeSelector,
  selectorStyle,
  highlighterStyle,
  elementLabel,
  elementFilter,
}) => {
  if (!isInspecting) return null;
  
  return (
    <>
      {/* Element selection overlay */}
      <ElementSelector
        onElementHovered={onElementHovered}
        onElementSelected={onElementSelected}
        onElementUnhovered={onElementUnhovered}
        ignoreList={selectedElements}
        excludeSelector={excludeSelector}
        style={selectorStyle}
        elementFilter={elementFilter}
      />
      
      {/* Highlight for hovered element */}
      <HoveredElement 
        hoveredElement={hoveredElement}
        elementLabel={elementLabel}
        highlighterStyle={highlighterStyle}
      />
      
      {/* Highlights for selected elements */}
      <SelectedElements
        selectedElements={selectedElements}
        elementLabel={elementLabel}
        highlighterStyle={highlighterStyle}
      />
    </>
  );
};
