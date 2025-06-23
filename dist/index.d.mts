import * as react_jsx_runtime from 'react/jsx-runtime';
import React from 'react';

interface ElementSelectorProps {
    /**
     * Callback when an element is hovered
     */
    onElementHovered: (element: HTMLElement) => void;
    /**
     * Callback when an element is no longer hovered
     */
    onElementUnhovered: () => void;
    /**
     * Callback when an element is selected
     */
    onElementSelected: (element: HTMLElement) => void;
    /**
     * List of elements to ignore during selection
     */
    ignoreList?: HTMLElement[];
    /**
     * CSS selector for elements to exclude
     */
    excludeSelector?: string;
    /**
     * CSS class name for the selector overlay
     */
    className?: string;
    /**
     * Custom styles for the selector overlay
     */
    style?: React.CSSProperties;
    /**
     * Custom filter function for elements
     * Return true to allow selection, false to prevent
     */
    elementFilter?: (element: HTMLElement) => boolean;
}
/**
 * ElementSelector component that creates an overlay to select DOM elements
 */
declare function ElementSelector({ onElementHovered, onElementUnhovered, onElementSelected, ignoreList, excludeSelector, className, style, elementFilter, }: ElementSelectorProps): react_jsx_runtime.JSX.Element;

interface ElementHighlighterProps {
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
declare function ElementHighlighter({ element, className, style, updateRate, children, borderColor, backgroundColor, }: ElementHighlighterProps): react_jsx_runtime.JSX.Element;

interface ElementInspectorProps {
    /**
     * Initial state of the inspector (active or not)
     */
    initialIsActive?: boolean;
    /**
     * CSS selector for elements to exclude from selection
     */
    excludeSelector?: string;
    /**
     * Custom label for selected elements
     */
    elementLabel?: (element: HTMLElement) => React.ReactNode;
    /**
     * Custom styles for the selector
     */
    selectorStyle?: React.CSSProperties;
    /**
     * Custom styles for the highlighter
     */
    highlighterStyle?: React.CSSProperties;
    /**
     * Whether to show the floating bubble menu button
     * @default false
     */
    showBubbleMenuButton?: boolean;
}
/**
 * A component that allows inspecting and selecting DOM elements with a UI for interaction
 */
declare function ElementInspector({ initialIsActive, excludeSelector, elementLabel, selectorStyle, highlighterStyle, showBubbleMenuButton, }: ElementInspectorProps): react_jsx_runtime.JSX.Element;

/**
 * Utility functions for DOM element inspection and manipulation
 */
/**
 * Checks if a point is within an element's bounds
 * @param element - The element to check
 * @param clientX - The x coordinate
 * @param clientY - The y coordinate
 * @returns Whether the point is within the element's bounds
 */
declare const isElementAtPoint: (element: HTMLElement, clientX: number, clientY: number) => boolean;
/**
 * Calculates the percentage offsets from a point to an element
 * @param refElement - The reference element
 * @param x - The x coordinate
 * @param y - The y coordinate
 * @returns The percentage offsets
 */
declare function getOffsetsFromPointToElement(refElement: HTMLElement, x: number, y: number): {
    offsetTop: number;
    offsetLeft: number;
};
/**
 * Gets the XPath for an element
 * @param element - The element to get the XPath for
 * @param useId - Whether to use the element's ID if available
 * @returns The XPath for the element
 */
declare const getXPathForElement: (element: HTMLElement, useId?: boolean) => string;
/**
 * Extracts relevant attributes from an HTMLElement
 * @param element - The element to get attributes from
 * @returns An object containing the element's attributes
 */
declare function getElementAttributes(element: HTMLElement): {
    [key: string]: string;
};
/**
 * Generates a detailed context string for a single HTMLElement
 * @param element - The element to generate context for
 * @param index - The index of the element
 * @param totalElements - The total number of elements
 * @returns A string containing the element's context
 */
declare function generateElementContext(element: HTMLElement, index: number, totalElements: number): string;
/**
 * Creates a prompt containing information about the selected elements
 * @param selectedElements - The selected elements
 * @param userPrompt - The user's prompt
 * @param url - The page URL
 * @returns A string containing the prompt
 */
declare function createElementsPrompt(selectedElements: HTMLElement[], userPrompt: string): string;
/**
 * Finds the most specific/innermost element at a given point
 * @param x - The x coordinate
 * @param y - The y coordinate
 * @param excludeSelector - CSS selector to exclude elements
 * @returns The most specific element at the point
 */
declare function getMostSpecificElementAtPoint(x: number, y: number, excludeSelector?: string): HTMLElement;

export { ElementHighlighter, ElementInspector, ElementSelector, createElementsPrompt, generateElementContext, getElementAttributes, getMostSpecificElementAtPoint, getOffsetsFromPointToElement, getXPathForElement, isElementAtPoint };
