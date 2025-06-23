"use client";
import React from "react";

/**
 * Styles for the hovered element
 */
export const hoveredElementStyles = {
  highlighter: {
    borderColor: "rgba(59, 130, 246, 0.8)",
    backgroundColor: "rgba(59, 130, 246, 0.2)",
  } as React.CSSProperties,
};

/**
 * Styles for the selected elements
 */
export const selectedElementStyles = {
  highlighter: {
    borderColor: "rgba(34, 197, 94, 0.8)",
    backgroundColor: "rgba(34, 197, 94, 0.2)",
  } as React.CSSProperties,
};
