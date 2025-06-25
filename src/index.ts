/**
 * The element-inspector package provides components and utilities for inspecting,
 * highlighting, and selecting DOM elements in web applications.
 * 
 * @packageDocumentation
 */
import './styles/global.css';

export { ElementSelector } from './ElementSelector';
export { ElementHighlighter } from './ElementHighlighter';
export { ElementInspector } from './ElementInspector';
export {
  getOffsetsFromPointToElement,
  getXPathForElement,
  getElementAttributes,
  generateElementContext,
  createElementsPrompt,
  isElementAtPoint,
  getMostSpecificElementAtPoint,
} from './utils';
