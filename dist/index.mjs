// src/ElementSelector.tsx
import React, { useCallback, useRef } from "react";

// src/utils.ts
function getElementAtPoint(x, y, excludeSelector) {
  return getMostSpecificElementAtPoint(x, y, excludeSelector);
}
var isElementAtPoint = (element, clientX, clientY) => {
  const boundingRect = element.getBoundingClientRect();
  const isInHorizontalBounds = clientX >= boundingRect.left && clientX <= boundingRect.left + boundingRect.width;
  const isInVerticalBounds = clientY >= boundingRect.top && clientY <= boundingRect.top + boundingRect.height;
  return isInHorizontalBounds && isInVerticalBounds;
};
function getOffsetsFromPointToElement(refElement, x, y) {
  const referenceClientBounds = refElement.getBoundingClientRect();
  const offsetTop = (y - referenceClientBounds.top) * 100 / referenceClientBounds.height;
  const offsetLeft = (x - referenceClientBounds.left) * 100 / referenceClientBounds.width;
  return {
    offsetTop,
    offsetLeft
  };
}
var getXPathForElement = (element, useId = true) => {
  if (element.id && useId) {
    return `//*[@id="${element.id}"]`;
  }
  let nodeElem = element;
  const parts = [];
  while (nodeElem && Node.ELEMENT_NODE === nodeElem.nodeType) {
    let nbOfPreviousSiblings = 0;
    let hasNextSiblings = false;
    let sibling = nodeElem.previousSibling;
    while (sibling) {
      if (sibling.nodeType !== Node.DOCUMENT_TYPE_NODE && sibling.nodeName === nodeElem.nodeName) {
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
    const prefix = nodeElem.prefix ? `${nodeElem.prefix}:` : "";
    const nth = nbOfPreviousSiblings || hasNextSiblings ? `[${nbOfPreviousSiblings + 1}]` : "";
    parts.push(prefix + nodeElem.localName + nth);
    nodeElem = nodeElem.parentElement;
  }
  return parts.length ? `/${parts.reverse().join("/")}` : "";
};
function getElementAttributes(element) {
  const attrs = {};
  const priorityAttrs = [
    "id",
    "class",
    "name",
    "type",
    "href",
    "src",
    "alt",
    "for",
    "placeholder"
  ];
  const dataAttrs = [];
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name.startsWith("data-")) {
      dataAttrs.push({ name: attr.name, value: attr.value });
    } else if (priorityAttrs.includes(attr.name.toLowerCase()) || attr.name.toLowerCase() !== "style") {
      attrs[attr.name] = attr.value;
    }
  }
  dataAttrs.forEach((da) => {
    attrs[da.name] = da.value;
  });
  return attrs;
}
function generateElementContext(element, index) {
  var _a;
  let context = `<element index="${index + 1}">
`;
  context += `  <tag>${element.tagName.toLowerCase()}</tag>
`;
  const id = element.id;
  if (id) {
    context += `  <id>${id}</id>
`;
  }
  const classes = Array.from(element.classList).join(", ");
  if (classes) {
    context += `  <classes>${classes}</classes>
`;
  }
  const attributes = getElementAttributes(element);
  if (Object.keys(attributes).length > 0) {
    context += `  <attributes>
`;
    for (const [key, value] of Object.entries(attributes)) {
      if (key.toLowerCase() !== "class" || !classes) {
        context += `    <${key}>${value}</${key}>
`;
      }
    }
    context += `  </attributes>
`;
  }
  const text = (_a = element.innerText) == null ? void 0 : _a.trim();
  if (text) {
    const maxLength = 100;
    context += `  <text>${text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}</text>
`;
  }
  context += `  <structural_context>
`;
  if (element.parentElement) {
    const parent = element.parentElement;
    context += `    <parent>
`;
    context += `      <tag>${parent.tagName.toLowerCase()}</tag>
`;
    if (parent.id) {
      context += `      <id>${parent.id}</id>
`;
    }
    const parentClasses = Array.from(parent.classList).join(", ");
    if (parentClasses) {
      context += `      <classes>${parentClasses}</classes>
`;
    }
    context += `    </parent>
`;
  } else {
    context += `    <parent>No parent element found (likely root or disconnected)</parent>
`;
  }
  context += `  </structural_context>
`;
  try {
    const styles = window.getComputedStyle(element);
    const relevantStyles = {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      display: styles.display
    };
    context += `  <styles>
`;
    for (const [key, value] of Object.entries(relevantStyles)) {
      context += `    <${key}>${value}</${key}>
`;
    }
    context += `  </styles>
`;
  } catch (e) {
    context += `  <styles>Could not retrieve computed styles</styles>
`;
  }
  context += `</element>
`;
  return context;
}
function createElementsPrompt(selectedElements, userPrompt) {
  if (!selectedElements || selectedElements.length === 0) {
    return `
    <request>
      <user_goal>${userPrompt}</user_goal>
      <context>No specific element was selected on the page. Please analyze the page code in general or ask for clarification.</context>
    </request>`.trim();
  }
  let detailedContext = "";
  selectedElements.forEach((element, index) => {
    detailedContext += generateElementContext(element, index);
  });
  return `
<request>
  <user_goal>${userPrompt}</user_goal>
  <selected_elements>
    ${detailedContext.trim()}
  </selected_elements>
</request>`.trim();
}
function getMostSpecificElementAtPoint(x, y, excludeSelector) {
  const fullExcludeSelector = excludeSelector ? `${excludeSelector}, .element-selector, [data-element-selector="true"]` : `.element-selector, [data-element-selector="true"]`;
  const elements = document.elementsFromPoint(x, y);
  const eligibleElements = elements.filter((element) => {
    if (fullExcludeSelector && (element.matches(fullExcludeSelector) || element.closest(fullExcludeSelector))) {
      return false;
    }
    if (element.closest("svg")) {
      return false;
    }
    if (element.classList.contains("element-selector") || element.hasAttribute("data-element-selector")) {
      return false;
    }
    return isElementAtPoint(element, x, y);
  });
  if (eligibleElements.length === 0) {
    return document.body;
  }
  const sortedElements = [...eligibleElements].sort((a, b) => {
    const aDepth = getElementDepth(a);
    const bDepth = getElementDepth(b);
    if (aDepth !== bDepth) {
      return bDepth - aDepth;
    }
    const aChildren = a.children.length;
    const bChildren = b.children.length;
    if (aChildren !== bChildren) {
      return aChildren - bChildren;
    }
    const aRect = a.getBoundingClientRect();
    const bRect = b.getBoundingClientRect();
    const aArea = aRect.width * aRect.height;
    const bArea = bRect.width * bRect.height;
    return aArea - bArea;
  });
  return sortedElements[0];
}
function getElementDepth(element) {
  let depth = 0;
  let current = element;
  while (current.parentElement) {
    depth++;
    current = current.parentElement;
  }
  return depth;
}

// src/ElementSelector.tsx
import { jsx } from "react/jsx-runtime";
function ElementSelector({
  onElementHovered,
  onElementUnhovered,
  onElementSelected,
  ignoreList = [],
  excludeSelector = "",
  className = "",
  style = {},
  useBasicSelection = false,
  selectionModeToggleKey = "Alt"
}) {
  const lastHoveredElement = useRef(null);
  const [isUsingBasicSelection, setIsUsingBasicSelection] = React.useState(useBasicSelection);
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === selectionModeToggleKey) {
        setIsUsingBasicSelection(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.key === selectionModeToggleKey) {
        setIsUsingBasicSelection(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [selectionModeToggleKey]);
  const handleMouseMove = useCallback(
    (event) => {
      const { clientX, clientY } = event;
      const overlayElement = event.currentTarget;
      if (overlayElement) {
        overlayElement.style.pointerEvents = "none";
      }
      const refElement = isUsingBasicSelection ? getElementAtPoint(clientX, clientY, excludeSelector) : getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      if (overlayElement) {
        overlayElement.style.pointerEvents = "auto";
      }
      if (ignoreList.includes(refElement)) return;
      if (refElement === overlayElement || overlayElement && overlayElement.contains(refElement)) {
        return;
      }
      if (lastHoveredElement.current !== refElement) {
        lastHoveredElement.current = refElement;
        onElementHovered(refElement);
      }
    },
    [onElementHovered, ignoreList, excludeSelector, isUsingBasicSelection]
  );
  const handleMouseLeave = useCallback(() => {
    lastHoveredElement.current = null;
    onElementUnhovered();
  }, [onElementUnhovered]);
  const handleMouseClick = useCallback(
    (event) => {
      event.preventDefault();
      event.stopPropagation();
      const { clientX, clientY } = event;
      const overlayElement = event.currentTarget;
      if (overlayElement) {
        overlayElement.style.pointerEvents = "none";
      }
      const clickedElement = isUsingBasicSelection ? getElementAtPoint(clientX, clientY, excludeSelector) : getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      if (overlayElement) {
        overlayElement.style.pointerEvents = "auto";
      }
      if (clickedElement === overlayElement || overlayElement && overlayElement.contains(clickedElement)) {
        return;
      }
      lastHoveredElement.current = clickedElement;
      onElementSelected(clickedElement);
    },
    [onElementSelected, ignoreList, excludeSelector, isUsingBasicSelection]
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `element-selector ${className}`,
      "data-element-selector": "true",
      style: {
        position: "fixed",
        inset: 0,
        height: "100vh",
        width: "100vw",
        cursor: isUsingBasicSelection ? "crosshair" : "cell",
        zIndex: 9999,
        pointerEvents: "auto",
        ...style
      },
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleMouseClick,
      role: "button",
      tabIndex: 0,
      children: isUsingBasicSelection && /* @__PURE__ */ jsx("div", { style: {
        position: "fixed",
        bottom: "10px",
        right: "10px",
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "5px 10px",
        borderRadius: "4px",
        fontSize: "12px",
        pointerEvents: "none"
      }, children: "Basic Selection Mode (Press Alt to toggle)" })
    }
  );
}

// src/ElementHighlighter.tsx
import { useCallback as useCallback2, useEffect, useRef as useRef2 } from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function ElementHighlighter({
  element,
  className = "",
  style = {},
  updateRate = 30,
  children,
  borderColor = "rgba(59, 130, 246, 0.8)",
  backgroundColor = "rgba(59, 130, 246, 0.2)"
}) {
  const boxRef = useRef2(null);
  const updateIntervalRef = useRef2(null);
  const updateBoxPosition = useCallback2(() => {
    if (boxRef.current && element) {
      const referenceRect = element.getBoundingClientRect();
      boxRef.current.style.top = `${referenceRect.top - 2}px`;
      boxRef.current.style.left = `${referenceRect.left - 2}px`;
      boxRef.current.style.width = `${referenceRect.width + 4}px`;
      boxRef.current.style.height = `${referenceRect.height + 4}px`;
    }
  }, [element]);
  useEffect(() => {
    updateBoxPosition();
    if (updateRate > 0) {
      const intervalId = window.setInterval(() => {
        updateBoxPosition();
      }, 1e3 / updateRate);
      updateIntervalRef.current = intervalId;
      return () => {
        if (updateIntervalRef.current !== null) {
          window.clearInterval(updateIntervalRef.current);
        }
      };
    }
  }, [updateBoxPosition, updateRate]);
  useEffect(() => {
    const handleResize = () => {
      updateBoxPosition();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateBoxPosition]);
  return /* @__PURE__ */ jsx2(
    "div",
    {
      className: `element-highlighter ${className}`,
      style: {
        position: "fixed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "4px",
        border: `2px solid ${borderColor}`,
        backgroundColor,
        transition: "all 100ms",
        zIndex: 9998,
        pointerEvents: "none",
        ...style
      },
      ref: boxRef,
      children
    }
  );
}

// src/ElementInspector.tsx
import { useCallback as useCallback3, useState, useEffect as useEffect2 } from "react";
import { SquareDashedMousePointer, MousePointer, X, Send } from "lucide-react";
import { Fragment, jsx as jsx3, jsxs } from "react/jsx-runtime";
function ElementInspector({
  initialIsActive = false,
  excludeSelector = ".element-inspector-bubble, .element-inspector-controls",
  elementLabel,
  selectorStyle,
  highlighterStyle
}) {
  const [isInspecting, setIsInspecting] = useState(initialIsActive);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const handleElementsSelected = useCallback3((elements) => {
    setSelectedElements(elements);
  }, []);
  const onPromptGenerated = useCallback3((prompt, elements) => {
    console.log("Generated prompt:", prompt);
    const promptEvent = new CustomEvent("promptGenerated", {
      detail: { prompt, elements }
    });
    document.dispatchEvent(promptEvent);
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({
        type: "ELEMENT_INSPECTOR_PROMPT",
        payload: {
          prompt,
          elements: elements.map((el) => {
            var _a;
            return {
              tagName: el.tagName,
              id: el.id,
              className: el.className,
              textContent: (_a = el.textContent) == null ? void 0 : _a.trim(),
              attributes: Array.from(el.attributes).map((attr) => ({
                name: attr.name,
                value: attr.value
              }))
            };
          })
        }
      }, "*");
      console.log("Sent postMessage to parent window");
    }
  }, []);
  const toggleInspection = useCallback3(() => {
    setIsInspecting(!isInspecting);
    if (isInspecting) {
      setSelectedElements([]);
    }
  }, [isInspecting]);
  useEffect2(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isInspecting) {
        setIsInspecting(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isInspecting]);
  const handleMenuToggle = useCallback3(() => {
    setIsMenuOpen(!isMenuOpen);
    setIsInspecting(!isMenuOpen);
  }, [isMenuOpen]);
  const handlePromptSubmit = useCallback3((e) => {
    e.preventDefault();
    if (selectedElements.length > 0 && userPrompt) {
      const prompt = createElementsPrompt(
        selectedElements,
        userPrompt
      );
      onPromptGenerated(prompt, selectedElements);
      setUserPrompt("");
    }
  }, [selectedElements, userPrompt, onPromptGenerated]);
  const handleElementHovered = useCallback3((element) => {
    setHoveredElement(element);
  }, []);
  const handleElementUnhovered = useCallback3(() => {
    setHoveredElement(null);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "app", children: [
    isInspecting && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx3(
        ElementSelector,
        {
          onElementHovered: handleElementHovered,
          onElementSelected: (element) => {
            const newSelectedElements = selectedElements.includes(element) ? selectedElements.filter((el) => el !== element) : [...selectedElements, element];
            handleElementsSelected(newSelectedElements);
          },
          onElementUnhovered: handleElementUnhovered,
          ignoreList: selectedElements,
          excludeSelector,
          style: selectorStyle,
          useBasicSelection: false,
          selectionModeToggleKey: "Alt"
        }
      ),
      hoveredElement && /* @__PURE__ */ jsx3(
        ElementHighlighter,
        {
          element: hoveredElement,
          borderColor: "rgba(59, 130, 246, 0.8)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(hoveredElement) : /* @__PURE__ */ jsx3("div", { className: "element-tag-label", style: {
            position: "absolute",
            top: "0.5px",
            left: "0.5px",
            backgroundColor: "rgba(52, 53, 65, 0.8)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "12px",
            color: "white",
            pointerEvents: "none"
          }, children: hoveredElement.tagName.toLowerCase() })
        }
      ),
      selectedElements.map((element, index) => /* @__PURE__ */ jsx3(
        ElementHighlighter,
        {
          element,
          borderColor: "rgba(34, 197, 94, 0.8)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(element) : /* @__PURE__ */ jsx3("div", { className: "element-tag-label", style: {
            position: "absolute",
            top: "0.5px",
            left: "0.5px",
            backgroundColor: "rgba(52, 53, 65, 0.8)",
            borderRadius: "4px",
            padding: "2px 6px",
            fontSize: "12px",
            color: "white",
            pointerEvents: "none"
          }, children: element.tagName.toLowerCase() })
        },
        `selected-${index}`
      ))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "fixed bottom-6 right-6 z-[9999] element-inspector-bubble element-inspector-controls", children: [
      /* @__PURE__ */ jsx3(
        "button",
        {
          onClick: handleMenuToggle,
          className: "bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-200 element-inspector-controls",
          title: "Element Inspector",
          children: isMenuOpen ? /* @__PURE__ */ jsx3(X, { size: 20 }) : /* @__PURE__ */ jsx3(SquareDashedMousePointer, { size: 20 })
        }
      ),
      (isMenuOpen || isInspecting) && /* @__PURE__ */ jsxs("div", { className: "absolute bottom-16 right-0 bg-white dark:bg-gray-800 rounded-lg shadow-xl p-4 w-[350px] transition-all duration-200 element-inspector-controls", children: [
        /* @__PURE__ */ jsxs("div", { className: "flex justify-between items-center mb-3 element-inspector-controls", children: [
          /* @__PURE__ */ jsx3("h3", { className: "text-sm font-medium text-gray-800 dark:text-gray-200", children: "Element Inspector" }),
          /* @__PURE__ */ jsx3(
            "button",
            {
              onClick: handleMenuToggle,
              className: "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 element-inspector-controls",
              "aria-label": "Close menu",
              children: /* @__PURE__ */ jsx3(X, { size: 16 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "mb-4 flex items-center justify-between element-inspector-controls", children: [
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2 element-inspector-controls", children: [
            /* @__PURE__ */ jsx3(MousePointer, { size: 18, className: "text-gray-600 dark:text-gray-300" }),
            /* @__PURE__ */ jsx3("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-200", children: "Inspection Mode" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-2", children: [
            selectedElements.length > 0 && /* @__PURE__ */ jsxs("span", { className: "text-xs font-medium text-green-600 dark:text-green-400", children: [
              selectedElements.length,
              " selected"
            ] }),
            /* @__PURE__ */ jsx3(
              "button",
              {
                onClick: toggleInspection,
                className: `px-3 py-1 rounded-full text-xs font-medium transition-colors element-inspector-controls ${isInspecting ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100" : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"}`,
                children: isInspecting ? "Active" : "Inactive"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxs("form", { onSubmit: handlePromptSubmit, className: "mt-3 element-inspector-controls", children: [
          /* @__PURE__ */ jsx3("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 element-inspector-controls", children: "Prompt" }),
          /* @__PURE__ */ jsxs("div", { className: "flex element-inspector-controls", children: [
            /* @__PURE__ */ jsx3(
              "input",
              {
                type: "text",
                value: userPrompt,
                onChange: (e) => setUserPrompt(e.target.value),
                className: `flex-1 p-2 text-sm border ${selectedElements.length > 0 ? "border-green-300 dark:border-green-600" : "border-gray-300 dark:border-gray-600"} rounded-l-md dark:bg-gray-700 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500 element-inspector-controls`,
                placeholder: selectedElements.length > 0 ? `Enter prompt for ${selectedElements.length} selected element(s)` : "Select elements first"
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                type: "submit",
                className: "bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-r-md transition-colors element-inspector-controls",
                children: /* @__PURE__ */ jsx3(Send, { size: 16 })
              }
            )
          ] })
        ] })
      ] })
    ] })
  ] });
}

// src/prompting.ts
function createPromptWithPlugins(selectedElements, userPrompt, url, contextSnippets = []) {
  const pluginContext = contextSnippets.length > 0 ? contextSnippets.map((snippet) => `
        <plugin_contexts>
<${snippet.pluginName}>
${snippet.contextSnippets.map((snippet2) => `    <${snippet2.promptContextName}>${typeof snippet2.content === "function" ? snippet2.content() : snippet2.content}</${snippet2.promptContextName}>`).join("\n")}
</${snippet.pluginName}>
</plugin_contexts>
        `.trim()).join("\n") : "";
  if (!selectedElements || selectedElements.length === 0) {
    return `
    <request>
      <user_goal>${userPrompt}</user_goal>
      <url>${url}</url>
      <context>No specific element was selected on the page. Please analyze the page code in general or ask for clarification.</context>
      ${pluginContext}
    </request>`.trim();
  }
  let detailedContext = "";
  selectedElements.forEach((element, index) => {
    detailedContext += generateElementContext2(element, index);
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
function getElementAttributes2(element) {
  const attrs = {};
  const priorityAttrs = [
    "id",
    "class",
    "name",
    "type",
    "href",
    "src",
    "alt",
    "for",
    "placeholder"
  ];
  const dataAttrs = [];
  for (let i = 0; i < element.attributes.length; i++) {
    const attr = element.attributes[i];
    if (attr.name.startsWith("data-")) {
      dataAttrs.push({ name: attr.name, value: attr.value });
    } else if (priorityAttrs.includes(attr.name.toLowerCase()) || attr.name.toLowerCase() !== "style") {
      attrs[attr.name] = attr.value;
    }
  }
  dataAttrs.forEach((da) => {
    attrs[da.name] = da.value;
  });
  return attrs;
}
function generateElementContext2(element, index) {
  var _a;
  let context = `<element index="${index + 1}">
`;
  context += `  <tag>${element.tagName.toLowerCase()}</tag>
`;
  const id = element.id;
  if (id) {
    context += `  <id>${id}</id>
`;
  }
  const classes = Array.from(element.classList).join(", ");
  if (classes) {
    context += `  <classes>${classes}</classes>
`;
  }
  const attributes = getElementAttributes2(element);
  if (Object.keys(attributes).length > 0) {
    context += `  <attributes>
`;
    for (const [key, value] of Object.entries(attributes)) {
      if (key.toLowerCase() !== "class" || !classes) {
        context += `    <${key}>${value}</${key}>
`;
      }
    }
    context += `  </attributes>
`;
  }
  const text = (_a = element.innerText) == null ? void 0 : _a.trim();
  if (text) {
    const maxLength = 100;
    context += `  <text>${text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}</text>
`;
  }
  context += `  <structural_context>
`;
  if (element.parentElement) {
    const parent = element.parentElement;
    context += `    <parent>
`;
    context += `      <tag>${parent.tagName.toLowerCase()}</tag>
`;
    if (parent.id) {
      context += `      <id>${parent.id}</id>
`;
    }
    const parentClasses = Array.from(parent.classList).join(", ");
    if (parentClasses) {
      context += `      <classes>${parentClasses}</classes>
`;
    }
    context += `    </parent>
`;
  } else {
    context += `    <parent>No parent element found (likely root or disconnected)</parent>
`;
  }
  context += `  </structural_context>
`;
  try {
    const styles = window.getComputedStyle(element);
    const relevantStyles = {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      display: styles.display
    };
    context += `  <styles>
`;
    for (const [key, value] of Object.entries(relevantStyles)) {
      context += `    <${key}>${value}</${key}>
`;
    }
    context += `  </styles>
`;
  } catch (e) {
    context += `  <styles>Could not retrieve computed styles</styles>
`;
  }
  context += `</element>
`;
  return context;
}
export {
  ElementHighlighter,
  ElementInspector,
  ElementSelector,
  createElementsPrompt,
  createPromptWithPlugins,
  generateElementContext,
  getElementAtPoint,
  getElementAttributes,
  getMostSpecificElementAtPoint,
  getOffsetsFromPointToElement,
  getXPathForElement,
  isElementAtPoint
};
//# sourceMappingURL=index.mjs.map