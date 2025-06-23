"use client";
import React from "react";
import { ElementHighlighter } from "../../ElementHighlighter";
import { ElementTagLabel } from "../ElementTagLabel";
import { hoveredElementStyles } from "../../styles/highlights-styles";

interface HoveredElementProps {
  hoveredElement: HTMLElement | null;
  elementLabel?: (element: HTMLElement) => React.ReactNode;
  highlighterStyle?: React.CSSProperties;
}

export const HoveredElement: React.FC<HoveredElementProps> = ({
  hoveredElement,
  elementLabel,
  highlighterStyle,
}) => {
  if (!hoveredElement) return null;

  return (
    <ElementHighlighter
      element={hoveredElement}
      borderColor={hoveredElementStyles.highlighter.borderColor}
      backgroundColor={hoveredElementStyles.highlighter.backgroundColor}
      style={highlighterStyle}
    >
      {elementLabel ? (
        elementLabel(hoveredElement)
      ) : (
        <ElementTagLabel element={hoveredElement} />
      )}
    </ElementHighlighter>
  );
};
