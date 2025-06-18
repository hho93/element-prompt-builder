/**
 * Types and utilities for creating structured prompts with element context
 */

/**
 * A context snippet that can be added to a prompt.
 */
export interface ContextSnippet {
  /**
   * The name of the context in the prompt
   */
  promptContextName: string;
  
  /**
   * The content of the context, either as a string or a function that returns a string or Promise<string>
   */
  content: string | (() => string | Promise<string>);
}

/**
 * A plugin's context snippets
 */
export interface PluginContextSnippets {
  /**
   * The name of the plugin
   */
  pluginName: string;
  
  /**
   * The context snippets provided by the plugin
   */
  contextSnippets: ContextSnippet[];
}

/**
 * Creates a comprehensive prompt for an AI model with element context
 * 
 * @param selectedElements - The selected DOM elements
 * @param userPrompt - The user's prompt text
 * @param url - The current page URL
 * @param contextSnippets - Optional additional context snippets from plugins
 * @returns A formatted XML-style prompt
 */
export function createPromptWithPlugins(
  selectedElements: HTMLElement[],
  userPrompt: string,
  url: string,
  contextSnippets: PluginContextSnippets[] = []
): string {
  // Format plugin context if provided
  const pluginContext = contextSnippets.length > 0
    ? contextSnippets
        .map((snippet) => `
        <plugin_contexts>
<${snippet.pluginName}>
${snippet.contextSnippets.map((snippet) => `    <${snippet.promptContextName}>${typeof snippet.content === 'function' ? snippet.content() : snippet.content}</${snippet.promptContextName}>`).join('\n')}
</${snippet.pluginName}>
</plugin_contexts>
        `.trim())
        .join('\n')
    : '';

  // Handle case with no selected elements
  if (!selectedElements || selectedElements.length === 0) {
    return `
    <request>
      <user_goal>${userPrompt}</user_goal>
      <url>${url}</url>
      <context>No specific element was selected on the page. Please analyze the page code in general or ask for clarification.</context>
      ${pluginContext}
    </request>`.trim();
  }

  // Generate context for each selected element
  let detailedContext = '';
  selectedElements.forEach((element, index) => {
    detailedContext += generateElementContext(element, index);
  });

  return `
<request>
  <user_goal>${userPrompt}</user_goal>
  <url>${url}</url>
  <selected_elements>
    ${detailedContext.trim()}
  </selected_elements>
  ${pluginContext}
</request>`.trim();
}

/**
 * Gets the attributes of an element that are relevant for context
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
  const dataAttrs: Array<{ name: string; value: string }> = [];

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
 * Generates detailed XML context for a DOM element
 */
export function generateElementContext(element: HTMLElement, index: number): string {
  let context = `<element index="${index + 1}">\n`;
  context += `  <tag>${element.tagName.toLowerCase()}</tag>\n`;

  const id = element.id;
  if (id) {
    context += `  <id>${id}</id>\n`;
  }

  const classes = Array.from(element.classList).join(', ');
  if (classes) {
    context += `  <classes>${classes}</classes>\n`;
  }

  const attributes = getElementAttributes(element);
  if (Object.keys(attributes).length > 0) {
    context += `  <attributes>\n`;
    for (const [key, value] of Object.entries(attributes)) {
      if (key.toLowerCase() !== 'class' || !classes) {
        context += `    <${key}>${value}</${key}>\n`;
      }
    }
    context += `  </attributes>\n`;
  }

  const text = element.innerText?.trim();
  if (text) {
    const maxLength = 100;
    context += `  <text>${text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}</text>\n`;
  }

  context += `  <structural_context>\n`;
  if (element.parentElement) {
    const parent = element.parentElement;
    context += `    <parent>\n`;
    context += `      <tag>${parent.tagName.toLowerCase()}</tag>\n`;
    if (parent.id) {
      context += `      <id>${parent.id}</id>\n`;
    }
    const parentClasses = Array.from(parent.classList).join(', ');
    if (parentClasses) {
      context += `      <classes>${parentClasses}</classes>\n`;
    }
    context += `    </parent>\n`;
  } else {
    context += `    <parent>No parent element found (likely root or disconnected)</parent>\n`;
  }
  context += `  </structural_context>\n`;

  try {
    const styles = window.getComputedStyle(element);
    const relevantStyles = {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      display: styles.display,
    };
    context += `  <styles>\n`;
    for (const [key, value] of Object.entries(relevantStyles)) {
      context += `    <${key}>${value}</${key}>\n`;
    }
    context += `  </styles>\n`;
  } catch (e) {
    context += `  <styles>Could not retrieve computed styles</styles>\n`;
  }

  context += `</element>\n`;
  return context;
}
