# Element Prompt Builder

A React component library for inspecting DOM elements and generating structured prompts for AI models based on selected elements.

## Features

- **Element Selection**: Select DOM elements by clicking on them
- **Element Highlighting**: Highlight selected elements with visible borders
- **Element Context**: Generate detailed context information about selected elements
- **AI Prompt Generation**: Create structured prompts for AI models with element context
- **Event System**: Cross-frame communication and DOM events for integration

## Installation

```bash
npm install element-prompt-builder
# or
yarn add element-prompt-builder
```

## Usage

### Basic Example

```tsx
import { ElementInspector } from 'element-prompt-builder';

function App() {
  return (
    <div>
      <h1>My Web App</h1>
      <ElementInspector 
        initialIsActive={false} 
        excludeSelector=".no-inspect"
      />
    </div>
  );
}
```

### Individual Components

You can also use the individual components for more control:

```tsx
import { useState } from 'react';
import { 
  ElementSelector, 
  ElementHighlighter
} from 'element-prompt-builder';

function CustomInspector() {
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(null);
  
  return (
    <>
      <ElementSelector
        onElementHovered={setHoveredElement}
        onElementUnhovered={() => setHoveredElement(null)}
        onElementSelected={(element) => console.log('Selected:', element)}
      />
      
      {hoveredElement && (
        <ElementHighlighter 
          element={hoveredElement}
          borderColor="rgba(255, 0, 0, 0.8)"
          backgroundColor="rgba(255, 0, 0, 0.2)"
        />
      )}
    </>
  );
}
```

### Using Utility Functions

```tsx
import { 
  getXPathForElement, 
  getElementAttributes, 
  generateElementContext,
  getMostSpecificElementAtPoint,
  isElementAtPoint,
  getOffsetsFromPointToElement,
  createElementsPrompt
} from 'element-prompt-builder';

// Get XPath for an element
const xpath = getXPathForElement(document.getElementById('myElement'));

// Get relevant attributes from an element
const attributes = getElementAttributes(document.getElementById('myElement'));

// Generate detailed context for an element
const context = generateElementContext(document.getElementById('myElement'), 0);

// Find the most specific element at a point
const element = getMostSpecificElementAtPoint(100, 200, '.exclude-me');

// Check if a point is within an element
const isInElement = isElementAtPoint(document.getElementById('myElement'), 100, 200);

// Get percentage offsets from a point to an element
const offsets = getOffsetsFromPointToElement(document.getElementById('myElement'), 100, 200);
```

### AI Prompt Generation

The package includes utilities for generating AI prompts from selected elements:

```tsx
import { 
  createElementsPrompt
} from 'element-prompt-builder';

// Generate a prompt for an AI model
const elementPrompt = createElementsPrompt(
  [document.getElementById('myButton')], // Array of selected elements
  "Please change this button's background color to blue and make the text bold" // User's question or prompt
);

// Use this prompt with your preferred AI model
console.log(elementPrompt);
```

## API Reference

### ElementInspector

Main component that provides a UI for selecting and highlighting elements.

```tsx
<ElementInspector
  initialIsActive={boolean} // Whether the inspector is active initially
  excludeSelector={string} // CSS selector for elements to exclude from selection
  maxElements={number} // Maximum number of elements that can be selected
  elementLabel={(element: HTMLElement) => ReactNode} // Custom label for selected elements
  selectorStyle={React.CSSProperties} // Custom styles for the selector
  highlighterStyle={React.CSSProperties} // Custom styles for the highlighter
/>
```

### ElementSelector

Component that creates an overlay to select DOM elements.

```tsx
<ElementSelector
  onElementHovered={(element: HTMLElement) => void} // Callback when an element is hovered
  onElementUnhovered={() => void} // Callback when an element is no longer hovered
  onElementSelected={(element: HTMLElement) => void} // Callback when an element is selected
  ignoreList={HTMLElement[]} // List of elements to ignore during selection
  excludeSelector={string} // CSS selector for elements to exclude
  className={string} // CSS class for the selector overlay
  style={React.CSSProperties} // Custom styles for the selector overlay
/>
```

### ElementHighlighter

Component that highlights a DOM element with a border.

```tsx
<ElementHighlighter
  element={HTMLElement} // The element to highlight
  className={string} // CSS class for the highlighter
  style={React.CSSProperties} // Custom styles for the highlighter
  updateRate={number} // Update rate in frames per second (0 to disable updates)
  borderColor={string} // Border color for the highlighter
  backgroundColor={string} // Background color for the highlighter
>
  {/* Optional content to render inside the highlighter */}
</ElementHighlighter>
```

## Event System

The Element Inspector component provides an event system to handle generated prompts in your application.

### Browser Events

When a prompt is generated, the component dispatches a custom DOM event that you can listen for:

```javascript
// Listen for prompt generation events
document.addEventListener('promptGenerated', (event) => {
  const { prompt, elements } = event.detail;
  console.log('Generated prompt:', prompt);
  console.log('Selected elements:', elements);
  
  // Handle the prompt in your application
  // For example, send it to an AI model API
});
```

### Cross-Frame Communication

When the Element Inspector is used inside an iframe, it communicates with the parent window using the `postMessage` API:

```javascript
// In the parent window
window.addEventListener('message', (event) => {
  // Check if the message is from the Element Inspector
  if (event.data.type === 'ELEMENT_INSPECTOR_PROMPT') {
    const { prompt, elements } = event.data.payload;
    console.log('Generated prompt:', prompt);
    console.log('Selected elements:', elements);
    
    // Handle the prompt in your parent application
  }
});
```

The `elements` array in the message payload contains serialized information about each selected DOM element, including:
- `tagName`: The HTML tag name
- `id`: The element's ID attribute
- `className`: The element's class names
- `textContent`: The text content of the element
- `attributes`: An array of the element's attributes (name-value pairs)

This allows you to process the prompt and element information even across different browsing contexts.

## License

MIT
