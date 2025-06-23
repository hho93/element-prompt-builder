"use client";
import React from "react";
import { ElementHighlighter } from "../../ElementHighlighter";
import { ElementTagLabel } from "../ElementTagLabel";
import { selectedElementStyles } from "../../styles/highlights-styles";

interface SelectedElementsProps {
  selectedElements: HTMLElement[];
  elementLabel?: (element: HTMLElement) => React.ReactNode;
  highlighterStyle?: React.CSSProperties;
}

export const SelectedElements: React.FC<SelectedElementsProps> = ({
  selectedElements,
  elementLabel,
  highlighterStyle,
}) => {
  return (
    <>
      {selectedElements.map((element, index) => {
        // Add data attribute to mark as selected for tracking
        element.setAttribute("data-element-inspector-selected", "true");
        return (
          <ElementHighlighter
            key={`selected-${index}`}
            element={element}
            borderColor={selectedElementStyles.highlighter.borderColor}
            backgroundColor={selectedElementStyles.highlighter.backgroundColor}
            style={highlighterStyle}
          >
            {elementLabel ? (
              elementLabel(element)
            ) : (
              <ElementTagLabel element={element} />
            )}
          </ElementHighlighter>
        );
      })}
    </>
  );
};
