# Element Prompt Builder

A React component library for inspecting DOM elements and generating structured prompts for AI models based on selected elements.

## Features

- **Element Selection**: Select DOM elements by clicking on them
- **Element Highlighting**: Highlight selected elements with customizable styles
- **Element Context**: Generate detailed context information about selected elements
- **AI Prompt Generation**: Create structured prompts for AI models with element context
- **Customizable UI**: Fully customizable styles and behavior

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
  ElementHighlighter, 
  getElementAtPoint 
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
  generateElementContext 
} from 'element-prompt-builder';

// Get XPath for an element
const xpath = getXPathForElement(document.getElementById('myElement'));

// Get relevant attributes from an element
const attributes = getElementAttributes(document.getElementById('myElement'));

// Generate detailed context for an element
const context = generateElementContext(document.getElementById('myElement'), 0);
```

### AI Prompt Generation

The package includes utilities for generating AI prompts from selected elements:

```tsx
import { 
  generatePrompt, 
  PromptTemplate 
} from 'element-prompt-builder';

// Create a custom prompt template
const template: PromptTemplate = {
  intro: "I'm looking at this UI element:",
  contextInstructions: "Here's the context of the element:",
  questionPrompt: "What does this element do?",
  systemInstructions: "Help me understand this element's purpose and functionality."
};

// Generate a prompt for an AI model
const elementPrompt = generatePrompt(
  document.getElementById('myButton'),
  template
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
  useBasicSelection={boolean} // Whether to use basic selection instead of most specific element selection
  selectionModeToggleKey={string} // Key to toggle selection mode (default: 'Alt')
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

## License

MIT
