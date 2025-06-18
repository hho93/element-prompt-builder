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
export const isElementAtPoint = (
  element: HTMLElement,
  clientX: number,
  clientY: number,
): boolean => {
  const boundingRect = element.getBoundingClientRect();

  const isInHorizontalBounds =
    clientX >= boundingRect.left &&
    clientX <= boundingRect.left + boundingRect.width;
  const isInVerticalBounds =
    clientY >= boundingRect.top &&
    clientY <= boundingRect.top + boundingRect.height;

  return isInHorizontalBounds && isInVerticalBounds;
};

/**
 * Calculates the percentage offsets from a point to an element
 * @param refElement - The reference element
 * @param x - The x coordinate
 * @param y - The y coordinate
 * @returns The percentage offsets
 */
export function getOffsetsFromPointToElement(
  refElement: HTMLElement,
  x: number,
  y: number,
): { offsetTop: number; offsetLeft: number } {
  const referenceClientBounds = refElement.getBoundingClientRect();

  const offsetTop =
    ((y - referenceClientBounds.top) * 100) / referenceClientBounds.height;
  const offsetLeft =
    ((x - referenceClientBounds.left) * 100) / referenceClientBounds.width;

  return {
    offsetTop,
    offsetLeft,
  };
}

/**
 * Gets the XPath for an element
 * @param element - The element to get the XPath for
 * @param useId - Whether to use the element's ID if available
 * @returns The XPath for the element
 */
export const getXPathForElement = (element: HTMLElement, useId = true): string => {
  if (element.id && useId) {
    return `//*[@id="${element.id}"]`;
  }

  let nodeElem: HTMLElement | null = element;
  const parts: string[] = [];
  while (nodeElem && Node.ELEMENT_NODE === nodeElem.nodeType) {
    let nbOfPreviousSiblings = 0;
    let hasNextSiblings = false;
    let sibling = nodeElem.previousSibling;
    while (sibling) {
      if (
        sibling.nodeType !== Node.DOCUMENT_TYPE_NODE &&
        sibling.nodeName === nodeElem.nodeName
      ) {
        nbOfPreviousSiblings++;
      }
      sibling = sibling.previousSibling;
    }
    sibling = nodeElem.nextSibling;
    while (sibling) {
      if (sibling.nodeName === nodeElem.nodeName) {
        hasNextSiblings = true;
        break;
      }
      sibling = sibling.nextSibling;
    }
    const prefix = nodeElem.prefix ? `${nodeElem.prefix}:` : '';
    const nth =
      nbOfPreviousSiblings || hasNextSiblings
        ? `[${nbOfPreviousSiblings + 1}]`
        : '';
    parts.push(prefix + nodeElem.localName + nth);
    nodeElem = nodeElem.parentElement;
  }
  return parts.length ? `/${parts.reverse().join('/')}` : '';
};

/**
 * Extracts relevant attributes from an HTMLElement
 * @param element - The element to get attributes from
 * @returns An object containing the element's attributes
 */
export function getElementAttributes(element: HTMLElement): { [key: string]: string } {
  const attrs: { [key: string]: string } = {};
  const priorityAttrs = [
    'id',
    'class',
    'name',
    'type',
    'href',
    'src',
    'alt',
    'for',
    'placeholder',
  ];
  const dataAttrs: { name: string; value: string }[] = [];

  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name.startsWith('data-')) {
      dataAttrs.push({ name: attr.name, value: attr.value });
    } else if (
      priorityAttrs.includes(attr.name.toLowerCase()) ||
      attr.name.toLowerCase() !== 'style'
    ) {
      attrs[attr.name] = attr.value;
    }
  }
  
  dataAttrs.forEach((da) => {
    attrs[da.name] = da.value;
  });
  
  return attrs;
}

/**
 * Generates a detailed context string for a single HTMLElement
 * @param element - The element to generate context for
 * @param index - The index of the element
 * @returns A string containing the element's context
 */
export function generateElementContext(element: HTMLElement, index: number): string {
  let context = `### Element ${index + 1}\n`;
  context += `- **Tag**: ${element.tagName.toLowerCase()}\n`;

  const id = element.id;
  if (id) {
    context += `- **ID**: ${id}\n`;
  }

  const classes = Array.from(element.classList).join(', ');
  if (classes) {
    context += `- **Classes**: ${classes}\n`;
  }

  const attributes = getElementAttributes(element);
  if (Object.keys(attributes).length > 0) {
    context += `- **Attributes**:\n`;
    for (const [key, value] of Object.entries(attributes)) {
      if (key.toLowerCase() !== 'class' || !classes) {
        context += `  - ${key}: ${value}\n`;
      }
    }
  }

  const text = element.innerText?.trim();
  if (text) {
    const maxLength = 100;
    context += `- **Text**: ${text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}\n`;
  }

  context += `- **Structural Context**:\n`;
  if (element.parentElement) {
    const parent = element.parentElement;
    context += `  - **Parent**:\n`;
    context += `    - Tag: ${parent.tagName.toLowerCase()}\n`;
    if (parent.id) {
      context += `    - ID: ${parent.id}\n`;
    }
    const parentClasses = Array.from(parent.classList).join(', ');
    if (parentClasses) {
      context += `    - Classes: ${parentClasses}\n`;
    }
  } else {
    context += `  - **Parent**: No parent element found (likely root or disconnected)\n`;
  }

  try {
    const styles = window.getComputedStyle(element);
    const relevantStyles = {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      display: styles.display,
    };
    context += `- **Styles**:\n`;
    for (const [key, value] of Object.entries(relevantStyles)) {
      context += `  - ${key}: ${value}\n`;
    }
  } catch (e) {
    context += `- **Styles**: Could not retrieve computed styles\n`;
  }

  context += `\n`;
  return context;
}

/**
 * Creates a prompt containing information about the selected elements
 * @param selectedElements - The selected elements
 * @param userPrompt - The user's prompt
 * @param url - The page URL
 * @returns A string containing the prompt
 */
export function createElementsPrompt(
  selectedElements: HTMLElement[],
  userPrompt: string,
): string {
  if (!selectedElements || selectedElements.length === 0) {
    return `
# Goal
${userPrompt}

## Context
No specific element was selected on the page. Please analyze the page code in general or ask for clarification.`.trim();
  }

  let detailedContext = '';
  selectedElements.forEach((element, index) => {
    detailedContext += generateElementContext(element, index);
  });

  return `
# Goal
${userPrompt}

## Selected Elements
${detailedContext.trim()}`.trim();
}

/**
 * Finds the most specific/innermost element at a given point
 * @param x - The x coordinate
 * @param y - The y coordinate
 * @param excludeSelector - CSS selector to exclude elements
 * @returns The most specific element at the point
 */
export function getMostSpecificElementAtPoint(
  x: number,
  y: number,
  excludeSelector?: string
): HTMLElement {
  // Add a default exclude for the element selector itself
  const fullExcludeSelector = excludeSelector 
    ? `${excludeSelector}, .element-selector, [data-element-selector="true"]` 
    : `.element-selector, [data-element-selector="true"]`;
    
  const elements = document.elementsFromPoint(x, y);
  
  // Filter out excluded elements and SVG elements
  const eligibleElements = elements.filter(element => {
    // Skip the element selector and any specified excludes
    if (fullExcludeSelector && 
       (element.matches(fullExcludeSelector) || 
        element.closest(fullExcludeSelector))) {
      return false;
    }
    
    // Skip SVG elements
    if (element.closest('svg')) {
      return false;
    }
    
    // Skip the element selector class or attribute
    if (element.classList.contains('element-selector') || 
        element.hasAttribute('data-element-selector')) {
      return false;
    }
    
    return isElementAtPoint(element as HTMLElement, x, y);
  }) as HTMLElement[];
  
  if (eligibleElements.length === 0) {
    return document.body;
  }
  
  // Sort elements by various criteria to find the most specific one
  const sortedElements = [...eligibleElements].sort((a, b) => {
    // 1. First check depth - deeper DOM elements are more specific
    const aDepth = getElementDepth(a);
    const bDepth = getElementDepth(b);
    
    if (aDepth !== bDepth) {
      return bDepth - aDepth; // Higher depth is more specific
    }
    
    // 2. If at same depth, prefer elements with less children
    const aChildren = a.children.length;
    const bChildren = b.children.length;
    
    if (aChildren !== bChildren) {
      return aChildren - bChildren; // Fewer children is more specific
    }
    
    // 3. If still tied, use element area
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    const aArea = aRect.width * aRect.height;
    const bArea = bRect.width * bRect.height;
    return aArea - bArea; // Smaller area is more specific
  });
  
  // Return the most specific eligible element
  return sortedElements[0];
}

/**
 * Helper function to calculate the depth of an element in the DOM tree
 * @param element - The element to check
 * @returns The depth of the element
 */
function getElementDepth(element: HTMLElement): number {
  let depth = 0;
  let current = element;
  
  while (current.parentElement) {
    depth++;
    current = current.parentElement;
  }
  
  return depth;
}
