"use client";
import React from "react";
import { elements } from "../styles";

interface ElementTagLabelProps {
  /**
   * The HTML element to display the tag for
   */
  element: HTMLElement;
}

/**
 * A label that displays the tag name of an HTML element
 */
export function ElementTagLabel({ element }: ElementTagLabelProps) {
  return (
    <div style={elements.elementTagLabel}>
      {element.tagName.toLowerCase()}
    </div>
  );
}
