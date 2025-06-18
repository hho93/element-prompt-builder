// src/ElementSelector.tsx
import { useCallback, useRef } from "react";

// src/utils.ts
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
  let context = `### Element ${index + 1}
`;
  context += `- **Tag**: ${element.tagName.toLowerCase()}
`;
  const id = element.id;
  if (id) {
    context += `- **ID**: ${id}
`;
  }
  const classes = Array.from(element.classList).join(", ");
  if (classes) {
    context += `- **Classes**: ${classes}
`;
  }
  const attributes = getElementAttributes(element);
  if (Object.keys(attributes).length > 0) {
    context += `- **Attributes**:
`;
    for (const [key, value] of Object.entries(attributes)) {
      if (key.toLowerCase() !== "class" || !classes) {
        context += `  - ${key}: ${value}
`;
      }
    }
  }
  const text2 = (_a = element.innerText) == null ? void 0 : _a.trim();
  if (text2) {
    const maxLength = 100;
    context += `- **Text**: ${text2.length > maxLength ? `${text2.substring(0, maxLength)}...` : text2}
`;
  }
  context += `- **Structural Context**:
`;
  if (element.parentElement) {
    const parent = element.parentElement;
    context += `  - **Parent**:
`;
    context += `    - Tag: ${parent.tagName.toLowerCase()}
`;
    if (parent.id) {
      context += `    - ID: ${parent.id}
`;
    }
    const parentClasses = Array.from(parent.classList).join(", ");
    if (parentClasses) {
      context += `    - Classes: ${parentClasses}
`;
    }
  } else {
    context += `  - **Parent**: No parent element found (likely root or disconnected)
`;
  }
  try {
    const styles = window.getComputedStyle(element);
    const relevantStyles = {
      color: styles.color,
      backgroundColor: styles.backgroundColor,
      fontSize: styles.fontSize,
      fontWeight: styles.fontWeight,
      display: styles.display
    };
    context += `- **Styles**:
`;
    for (const [key, value] of Object.entries(relevantStyles)) {
      context += `  - ${key}: ${value}
`;
    }
  } catch (e) {
    context += `- **Styles**: Could not retrieve computed styles
`;
  }
  context += `
`;
  return context;
}
function createElementsPrompt(selectedElements, userPrompt) {
  if (!selectedElements || selectedElements.length === 0) {
    return `
# Goal
${userPrompt}

## Context
No specific element was selected on the page. Please analyze the page code in general or ask for clarification.`.trim();
  }
  let detailedContext = "";
  selectedElements.forEach((element, index) => {
    detailedContext += generateElementContext(element, index);
  });
  return `
# Goal
${userPrompt}

## Selected Elements
${detailedContext.trim()}`.trim();
}
function getMostSpecificElementAtPoint(x, y, excludeSelector) {
  const fullExcludeSelector = excludeSelector ? `${excludeSelector}, .element-selector, [data-element-selector="true"]` : `.element-selector, [data-element-selector="true"]`;
  const elements2 = document.elementsFromPoint(x, y);
  const eligibleElements = elements2.filter((element) => {
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
  style = {}
}) {
  const lastHoveredElement = useRef(null);
  const handleMouseMove = useCallback(
    (event) => {
      const { clientX, clientY } = event;
      const overlayElement = event.currentTarget;
      if (overlayElement) {
        overlayElement.style.pointerEvents = "none";
      }
      const refElement = getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
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
    [onElementHovered, ignoreList, excludeSelector]
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
      const clickedElement = getMostSpecificElementAtPoint(clientX, clientY, excludeSelector);
      if (overlayElement) {
        overlayElement.style.pointerEvents = "auto";
      }
      if (clickedElement === overlayElement || overlayElement && overlayElement.contains(clickedElement)) {
        return;
      }
      lastHoveredElement.current = clickedElement;
      onElementSelected(clickedElement);
    },
    [onElementSelected, ignoreList, excludeSelector]
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
        cursor: "cell",
        zIndex: 9999,
        pointerEvents: "auto",
        ...style
      },
      onMouseMove: handleMouseMove,
      onMouseLeave: handleMouseLeave,
      onClick: handleMouseClick,
      role: "button",
      tabIndex: 0
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

// src/Icons.tsx
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var IconPointer = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-mouse-pointer-click-icon lucide-mouse-pointer-click", children: [
  /* @__PURE__ */ jsx3("path", { d: "M14 4.1 12 6" }),
  /* @__PURE__ */ jsx3("path", { d: "m5.1 8-2.9-.8" }),
  /* @__PURE__ */ jsx3("path", { d: "m6 12-1.9 2" }),
  /* @__PURE__ */ jsx3("path", { d: "M7.2 2.2 8 5.1" }),
  /* @__PURE__ */ jsx3("path", { d: "M9.037 9.69a.498.498 0 0 1 .653-.653l11 4.5a.5.5 0 0 1-.074.949l-4.349 1.041a1 1 0 0 0-.74.739l-1.04 4.35a.5.5 0 0 1-.95.074z" })
] });
var IconSquareDashedPointer = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-square-dashed-mouse-pointer-icon lucide-square-dashed-mouse-pointer", children: [
  /* @__PURE__ */ jsx3("path", { d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" }),
  /* @__PURE__ */ jsx3("path", { d: "M5 3a2 2 0 0 0-2 2" }),
  /* @__PURE__ */ jsx3("path", { d: "M19 3a2 2 0 0 1 2 2" }),
  /* @__PURE__ */ jsx3("path", { d: "M5 21a2 2 0 0 1-2-2" }),
  /* @__PURE__ */ jsx3("path", { d: "M9 3h1" }),
  /* @__PURE__ */ jsx3("path", { d: "M9 21h2" }),
  /* @__PURE__ */ jsx3("path", { d: "M14 3h1" }),
  /* @__PURE__ */ jsx3("path", { d: "M3 9v1" }),
  /* @__PURE__ */ jsx3("path", { d: "M21 9v2" }),
  /* @__PURE__ */ jsx3("path", { d: "M3 14v1" })
] });
var IconX = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx3("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
  /* @__PURE__ */ jsx3("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
] });
var IconSend = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
  /* @__PURE__ */ jsx3("path", { d: "m22 2-7 20-4-9-9-4Z" }),
  /* @__PURE__ */ jsx3("path", { d: "M22 2 11 13" })
] });

// src/styles.ts
var layout = {
  bubble: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: 9999
  },
  expandedMenu: {
    position: "absolute",
    bottom: "64px",
    right: "0",
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    padding: "16px",
    width: "350px",
    transition: "all 0.2s ease"
  },
  menuHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "12px"
  },
  inspectorToggle: {
    marginBottom: "16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  },
  toggleLeft: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  toggleRight: {
    display: "flex",
    alignItems: "center",
    gap: "8px"
  },
  promptForm: {
    marginTop: "12px"
  },
  inputContainer: {
    display: "flex"
  }
};
var buttons = {
  mainButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "12px",
    borderRadius: "50%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  mainButtonHover: {
    backgroundColor: "#2563eb"
  },
  closeButton: {
    color: "#6b7280",
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: "4px"
  },
  closeButtonHover: {
    color: "#374151"
  },
  toggleButton: {
    padding: "4px 12px",
    borderRadius: "9999px",
    fontSize: "12px",
    fontWeight: "500",
    border: "none",
    cursor: "pointer",
    transition: "colors 0.2s ease"
  },
  submitButton: {
    backgroundColor: "#3b82f6",
    color: "white",
    padding: "8px 12px",
    borderTopRightRadius: "6px",
    borderBottomRightRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  submitButtonHover: {
    backgroundColor: "#2563eb"
  }
};
var text = {
  menuTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#1f2937"
  },
  toggleText: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151"
  },
  selectedCount: {
    fontSize: "12px",
    fontWeight: "500",
    color: "#10b981"
  },
  promptLabel: {
    display: "block",
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
    marginBottom: "4px"
  }
};
var inputs = {
  promptInput: {
    flexGrow: 1,
    padding: "8px",
    fontSize: "14px",
    border: "1px solid #d1d5db",
    borderTopLeftRadius: "6px",
    borderBottomLeftRadius: "6px",
    outline: "none",
    borderColor: "#d1d5db"
  },
  promptInputFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.5)"
  },
  promptInputSelected: {
    borderColor: "#10b981"
  }
};
var elements = {
  elementTagLabel: {
    position: "absolute",
    top: "0.5px",
    left: "0.5px",
    backgroundColor: "rgba(52, 53, 65, 0.8)",
    borderRadius: "4px",
    padding: "2px 6px",
    fontSize: "12px",
    color: "white",
    pointerEvents: "none"
  }
};
var states = {
  toggleButtonActive: {
    backgroundColor: "#dcfce7",
    color: "#065f46"
  },
  toggleButtonInactive: {
    backgroundColor: "#f3f4f6",
    color: "#1f2937"
  }
};
var darkMode = {
  expandedMenu: {
    backgroundColor: "#1f2937"
  },
  menuTitle: {
    color: "#e5e7eb"
  },
  closeButtonHover: {
    color: "#e5e7eb"
  },
  toggleText: {
    color: "#e5e7eb"
  },
  selectedCount: {
    color: "#34d399"
  },
  toggleButtonActive: {
    backgroundColor: "#064e3b",
    color: "#ecfdf5"
  },
  toggleButtonInactive: {
    backgroundColor: "#374151",
    color: "#d1d5db"
  },
  promptLabel: {
    color: "#d1d5db"
  },
  promptInput: {
    backgroundColor: "#374151",
    color: "white",
    borderColor: "#4b5563"
  }
};

// src/components.tsx
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
var ElementTagLabel = ({ element }) => /* @__PURE__ */ jsx4("div", { style: elements.elementTagLabel, children: element.tagName.toLowerCase() });
var BubbleMenuButton = ({ isOpen, onClick }) => /* @__PURE__ */ jsx4(
  "button",
  {
    onClick,
    style: buttons.mainButton,
    onMouseOver: (e) => {
      e.currentTarget.style.backgroundColor = buttons.mainButtonHover.backgroundColor;
    },
    onMouseOut: (e) => {
      e.currentTarget.style.backgroundColor = buttons.mainButton.backgroundColor;
    },
    title: "Element Inspector",
    className: "element-inspector-controls",
    children: isOpen ? /* @__PURE__ */ jsx4(IconX, {}) : /* @__PURE__ */ jsx4(IconSquareDashedPointer, {})
  }
);
var InspectorToggle = ({
  isInspecting,
  selectedCount,
  toggleInspection,
  isDarkMode,
  maxElements = 5
}) => /* @__PURE__ */ jsxs2(
  "div",
  {
    className: "element-inspector-controls",
    style: layout.inspectorToggle,
    children: [
      /* @__PURE__ */ jsxs2(
        "div",
        {
          className: "element-inspector-controls",
          style: layout.toggleLeft,
          children: [
            /* @__PURE__ */ jsx4(IconPointer, {}),
            /* @__PURE__ */ jsx4(
              "span",
              {
                style: {
                  ...text.toggleText,
                  ...isDarkMode ? darkMode.toggleText : {}
                },
                children: "Inspection Mode"
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsxs2("div", { style: layout.toggleRight, children: [
        selectedCount > 0 && /* @__PURE__ */ jsxs2(
          "span",
          {
            style: {
              ...text.selectedCount,
              ...isDarkMode ? darkMode.selectedCount : {}
            },
            children: [
              selectedCount,
              "/",
              maxElements,
              " selected"
            ]
          }
        ),
        /* @__PURE__ */ jsx4(
          "button",
          {
            onClick: toggleInspection,
            style: {
              ...buttons.toggleButton,
              ...isInspecting ? isDarkMode ? { ...darkMode.toggleButtonActive } : { ...states.toggleButtonActive } : isDarkMode ? { ...darkMode.toggleButtonInactive } : { ...states.toggleButtonInactive }
            },
            className: "element-inspector-controls",
            children: isInspecting ? "Active" : "Inactive"
          }
        )
      ] })
    ]
  }
);
var PromptForm = ({
  userPrompt,
  setUserPrompt,
  handlePromptSubmit,
  selectedElementsCount,
  isDarkMode
}) => /* @__PURE__ */ jsxs2(
  "form",
  {
    onSubmit: handlePromptSubmit,
    style: layout.promptForm,
    className: "element-inspector-controls",
    children: [
      /* @__PURE__ */ jsx4(
        "label",
        {
          style: {
            ...text.promptLabel,
            ...isDarkMode ? darkMode.promptLabel : {}
          },
          className: "element-inspector-controls",
          children: "Prompt"
        }
      ),
      /* @__PURE__ */ jsxs2(
        "div",
        {
          style: layout.inputContainer,
          className: "element-inspector-controls",
          children: [
            /* @__PURE__ */ jsx4(
              "input",
              {
                type: "text",
                value: userPrompt,
                onChange: (e) => setUserPrompt(e.target.value),
                style: {
                  ...inputs.promptInput,
                  ...isDarkMode ? darkMode.promptInput : {},
                  ...selectedElementsCount > 0 ? inputs.promptInputSelected : {}
                },
                onFocus: (e) => {
                  e.currentTarget.style.boxShadow = inputs.promptInputFocus.boxShadow;
                  e.currentTarget.style.borderColor = inputs.promptInputFocus.borderColor;
                },
                onBlur: (e) => {
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = selectedElementsCount > 0 ? inputs.promptInputSelected.borderColor : isDarkMode ? darkMode.promptInput.borderColor : inputs.promptInput.borderColor;
                },
                placeholder: selectedElementsCount > 0 ? `Enter prompt for ${selectedElementsCount} selected element(s)` : "Select elements first",
                className: "element-inspector-controls"
              }
            ),
            /* @__PURE__ */ jsx4(
              "button",
              {
                type: "submit",
                style: buttons.submitButton,
                onMouseOver: (e) => {
                  e.currentTarget.style.backgroundColor = buttons.submitButtonHover.backgroundColor;
                },
                onMouseOut: (e) => {
                  e.currentTarget.style.backgroundColor = buttons.submitButton.backgroundColor;
                },
                className: "element-inspector-controls",
                children: /* @__PURE__ */ jsx4(IconSend, {})
              }
            )
          ]
        }
      )
    ]
  }
);

// src/ElementInspector.tsx
import { Fragment, jsx as jsx5, jsxs as jsxs3 } from "react/jsx-runtime";
function ElementInspector({
  initialIsActive = false,
  excludeSelector = ".element-inspector-bubble, .element-inspector-controls",
  elementLabel,
  selectorStyle,
  highlighterStyle,
  maxElements = 5
}) {
  const [isInspecting, setIsInspecting] = useState(initialIsActive);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [selectedElements, setSelectedElements] = useState([]);
  const [userPrompt, setUserPrompt] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect2(() => {
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  const handleElementsSelected = useCallback3((elements2) => {
    setSelectedElements(elements2);
  }, []);
  const handleElementHovered = useCallback3((element) => {
    setHoveredElement(element);
  }, []);
  const handleElementUnhovered = useCallback3(() => {
    setHoveredElement(null);
  }, []);
  const onPromptGenerated = useCallback3((prompt, elements2) => {
    console.log("Generated prompt:", prompt);
    const promptEvent = new CustomEvent("promptGenerated", {
      detail: { prompt, elements: elements2 }
    });
    document.dispatchEvent(promptEvent);
    const isInIframe = window.self !== window.top;
    if (isInIframe) {
      window.parent.postMessage({
        type: "ELEMENT_INSPECTOR_PROMPT",
        payload: {
          prompt,
          elements: elements2.map((el) => {
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
  const elementSelectorProps = {
    onElementHovered: handleElementHovered,
    onElementSelected: (element) => {
      const isElementSelected = selectedElements.includes(element);
      if (isElementSelected) {
        const newSelectedElements = selectedElements.filter((el) => el !== element);
        handleElementsSelected(newSelectedElements);
      } else if (selectedElements.length < maxElements) {
        const newSelectedElements = [...selectedElements, element];
        handleElementsSelected(newSelectedElements);
      }
    },
    onElementUnhovered: handleElementUnhovered,
    ignoreList: selectedElements,
    excludeSelector,
    style: selectorStyle
  };
  return /* @__PURE__ */ jsxs3("div", { children: [
    isInspecting && /* @__PURE__ */ jsxs3(Fragment, { children: [
      /* @__PURE__ */ jsx5(ElementSelector, { ...elementSelectorProps }),
      hoveredElement && /* @__PURE__ */ jsx5(
        ElementHighlighter,
        {
          element: hoveredElement,
          borderColor: "rgba(59, 130, 246, 0.8)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(hoveredElement) : /* @__PURE__ */ jsx5(ElementTagLabel, { element: hoveredElement })
        }
      ),
      selectedElements.map((element, index) => /* @__PURE__ */ jsx5(
        ElementHighlighter,
        {
          element,
          borderColor: "rgba(34, 197, 94, 0.8)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(element) : /* @__PURE__ */ jsx5(ElementTagLabel, { element })
        },
        `selected-${index}`
      ))
    ] }),
    /* @__PURE__ */ jsxs3(
      "div",
      {
        className: "element-inspector-bubble element-inspector-controls",
        style: layout.bubble,
        children: [
          /* @__PURE__ */ jsx5(BubbleMenuButton, { isOpen: isMenuOpen, onClick: handleMenuToggle }),
          (isMenuOpen || isInspecting) && /* @__PURE__ */ jsxs3(
            "div",
            {
              className: "element-inspector-controls",
              style: {
                ...layout.expandedMenu,
                ...isDarkMode ? darkMode.expandedMenu : {}
              },
              children: [
                /* @__PURE__ */ jsxs3(
                  "div",
                  {
                    className: "element-inspector-controls",
                    style: layout.menuHeader,
                    children: [
                      /* @__PURE__ */ jsx5(
                        "h3",
                        {
                          style: {
                            ...text.menuTitle,
                            ...isDarkMode ? darkMode.menuTitle : {}
                          },
                          children: "Element Inspector"
                        }
                      ),
                      /* @__PURE__ */ jsx5(
                        "button",
                        {
                          onClick: handleMenuToggle,
                          style: {
                            ...buttons.closeButton
                          },
                          onMouseOver: (e) => {
                            e.currentTarget.style.color = isDarkMode ? darkMode.closeButtonHover.color : buttons.closeButtonHover.color;
                          },
                          onMouseOut: (e) => {
                            e.currentTarget.style.color = buttons.closeButton.color;
                          },
                          "aria-label": "Close menu",
                          className: "element-inspector-controls",
                          children: /* @__PURE__ */ jsx5(IconX, {})
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsx5(
                  InspectorToggle,
                  {
                    isInspecting,
                    selectedCount: selectedElements.length,
                    toggleInspection,
                    isDarkMode,
                    maxElements
                  }
                ),
                /* @__PURE__ */ jsx5(
                  PromptForm,
                  {
                    userPrompt,
                    setUserPrompt,
                    handlePromptSubmit,
                    selectedElementsCount: selectedElements.length,
                    isDarkMode
                  }
                )
              ]
            }
          )
        ]
      }
    )
  ] });
}
export {
  ElementHighlighter,
  ElementInspector,
  ElementSelector,
  createElementsPrompt,
  generateElementContext,
  getElementAttributes,
  getMostSpecificElementAtPoint,
  getOffsetsFromPointToElement,
  getXPathForElement,
  isElementAtPoint
};
//# sourceMappingURL=index.mjs.map