"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  ElementHighlighter: () => ElementHighlighter,
  ElementInspector: () => ElementInspector,
  ElementSelector: () => ElementSelector,
  createElementsPrompt: () => createElementsPrompt,
  generateElementContext: () => generateElementContext,
  getElementAttributes: () => getElementAttributes,
  getMostSpecificElementAtPoint: () => getMostSpecificElementAtPoint,
  getOffsetsFromPointToElement: () => getOffsetsFromPointToElement,
  getXPathForElement: () => getXPathForElement,
  isElementAtPoint: () => isElementAtPoint
});
module.exports = __toCommonJS(index_exports);

// src/ElementSelector.tsx
var import_react = require("react");

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
function generateElementContext(element, index, totalElements) {
  var _a;
  let context = "";
  if (totalElements > 1) {
    context += `### Element ${index + 1}
`;
  }
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
  const text = (_a = element.innerText) == null ? void 0 : _a.trim();
  if (text) {
    const maxLength = 100;
    context += `- **Text**: ${text.length > maxLength ? `${text.substring(0, maxLength)}...` : text}
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
${userPrompt}

## Context
No specific element was selected on the page. Please analyze the page code in general or ask for clarification.`.trim();
  }
  let detailedContext = "";
  const totalElements = selectedElements.length;
  selectedElements.forEach((element, index) => {
    detailedContext += generateElementContext(element, index, totalElements);
  });
  const sectionHeader = totalElements > 1 ? "## Selected Elements" : "## Selected Element";
  return `
${userPrompt}

${sectionHeader}
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
var import_jsx_runtime = require("react/jsx-runtime");
function ElementSelector({
  onElementHovered,
  onElementUnhovered,
  onElementSelected,
  ignoreList = [],
  excludeSelector = "",
  className = "",
  style = {}
}) {
  const lastHoveredElement = (0, import_react.useRef)(null);
  const handleMouseMove = (0, import_react.useCallback)(
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
  const handleMouseLeave = (0, import_react.useCallback)(() => {
    lastHoveredElement.current = null;
    onElementUnhovered();
  }, [onElementUnhovered]);
  const handleMouseClick = (0, import_react.useCallback)(
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
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
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
var import_react2 = require("react");
var import_jsx_runtime2 = require("react/jsx-runtime");
function ElementHighlighter({
  element,
  className = "",
  style = {},
  updateRate = 30,
  children,
  borderColor = "rgba(59, 130, 246, 0.8)",
  backgroundColor = "rgba(59, 130, 246, 0.2)"
}) {
  const boxRef = (0, import_react2.useRef)(null);
  const updateIntervalRef = (0, import_react2.useRef)(null);
  const updateBoxPosition = (0, import_react2.useCallback)(() => {
    if (boxRef.current && element) {
      const referenceRect = element.getBoundingClientRect();
      boxRef.current.style.top = `${referenceRect.top - 2}px`;
      boxRef.current.style.left = `${referenceRect.left - 2}px`;
      boxRef.current.style.width = `${referenceRect.width + 4}px`;
      boxRef.current.style.height = `${referenceRect.height + 4}px`;
    }
  }, [element]);
  (0, import_react2.useEffect)(() => {
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
  (0, import_react2.useEffect)(() => {
    const handleResize = () => {
      updateBoxPosition();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [updateBoxPosition]);
  return /* @__PURE__ */ (0, import_jsx_runtime2.jsx)(
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
var import_react8 = require("react");

// src/styles.ts
var layout = {
  bubble: {
    position: "fixed",
    zIndex: 9999
    // Dynamic positioning will be handled in the component
  },
  expandedMenu: {
    backgroundColor: "white",
    borderRadius: "8px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    padding: "16px",
    width: "300px",
    transition: "all 0.15s ease-in-out",
    zIndex: 9999,
    position: "relative"
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
    borderRadius: "50%",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px"
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
    padding: "8px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    transition: "background-color 0.2s ease"
  },
  submitButtonHover: {
    backgroundColor: "#2563eb"
  }
};
var inputs = {
  promptInput: {
    flexGrow: 1,
    minHeight: "30px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    borderColor: "transparent",
    padding: 0
  },
  promptInputFocus: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 1px rgba(59, 130, 246, 0.5)"
  },
  promptInputSelected: {
    borderColor: "transparent"
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
  },
  menuArrow: {
    position: "absolute",
    width: 0,
    height: 0,
    borderLeft: "8px solid transparent",
    borderRight: "8px solid transparent",
    zIndex: 10001,
    transform: "translateX(-8px)",
    transition: "all 0.15s ease-in-out"
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
    borderColor: "transparent"
  }
};

// src/Icons.tsx
var import_jsx_runtime3 = require("react/jsx-runtime");
var IconSquareDashedPointer = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsxs)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-square-dashed-mouse-pointer-icon lucide-square-dashed-mouse-pointer", children: [
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5 3a2 2 0 0 0-2 2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M19 3a2 2 0 0 1 2 2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M5 21a2 2 0 0 1-2-2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M9 3h1" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M9 21h2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M14 3h1" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M3 9v1" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M21 9v2" }),
  /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("path", { d: "M3 14v1" })
] });
var IconTick = () => /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ (0, import_jsx_runtime3.jsx)("polyline", { points: "20 6 9 17 4 12" }) });

// src/components/BubbleMenuButton.tsx
var import_jsx_runtime4 = require("react/jsx-runtime");
function BubbleMenuButton({
  isInspecting,
  onClick
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(
    "button",
    {
      onClick,
      style: {
        ...buttons.mainButton,
        backgroundColor: isInspecting ? "#2563eb" : "#93c5fd",
        // Lighter blue when not enabled
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
      },
      onMouseOver: (e) => {
        e.currentTarget.style.backgroundColor = isInspecting ? "#1d4ed8" : "#60a5fa";
      },
      onMouseOut: (e) => {
        e.currentTarget.style.backgroundColor = isInspecting ? "#2563eb" : "#93c5fd";
      },
      title: isInspecting ? "Disable Element Inspector" : "Enable Element Inspector",
      children: /* @__PURE__ */ (0, import_jsx_runtime4.jsx)(IconSquareDashedPointer, {})
    }
  );
}

// src/components/ElementTagLabel.tsx
var import_jsx_runtime5 = require("react/jsx-runtime");
function ElementTagLabel({ element }) {
  return /* @__PURE__ */ (0, import_jsx_runtime5.jsx)("div", { style: elements.elementTagLabel, children: element.tagName.toLowerCase() });
}

// src/components/PromptForm.tsx
var import_jsx_runtime6 = require("react/jsx-runtime");
function PromptForm({
  userPrompt,
  setUserPrompt,
  handlePromptSubmit,
  selectedElementsCount,
  isDarkMode
}) {
  return /* @__PURE__ */ (0, import_jsx_runtime6.jsx)("form", { onSubmit: handlePromptSubmit, children: /* @__PURE__ */ (0, import_jsx_runtime6.jsxs)(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "row",
        gap: "8px",
        alignItems: "flex-start",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "textarea",
          {
            value: userPrompt,
            onChange: (e) => setUserPrompt(e.target.value),
            style: {
              ...inputs.promptInput,
              ...isDarkMode ? darkMode.promptInput : {},
              ...selectedElementsCount > 0 ? inputs.promptInputSelected : {},
              resize: "none"
            },
            placeholder: "Enter your prompt about the selected element..."
          }
        ),
        /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(
          "button",
          {
            type: "submit",
            style: {
              ...buttons.submitButton,
              borderRadius: "50%",
              padding: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            onMouseOver: (e) => {
              e.currentTarget.style.backgroundColor = buttons.submitButtonHover.backgroundColor;
            },
            onMouseOut: (e) => {
              e.currentTarget.style.backgroundColor = buttons.submitButton.backgroundColor;
            },
            children: /* @__PURE__ */ (0, import_jsx_runtime6.jsx)(IconTick, {})
          }
        )
      ]
    }
  ) });
}

// src/hooks/useDarkMode.ts
var import_react3 = require("react");
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = (0, import_react3.useState)(false);
  (0, import_react3.useEffect)(() => {
    const isDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e) => setIsDarkMode(e.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return isDarkMode;
}

// src/hooks/useElementBubblePosition.ts
var import_react4 = require("react");
function useElementBubblePosition({
  selectedElements,
  menuHeight = 75,
  menuWidth = 300,
  spacing = 10
}) {
  const [bubblePosition, setBubblePosition] = (0, import_react4.useState)({ top: 0, left: 0, arrowOffset: 20 });
  const [isMenuAboveElement, setIsMenuAboveElement] = (0, import_react4.useState)(false);
  (0, import_react4.useEffect)(() => {
    if (selectedElements.length === 0) return;
    const updateBubblePosition = () => {
      const lastElement = selectedElements[selectedElements.length - 1];
      const rect = lastElement.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const elementCenterX = rect.left + rect.width / 2;
      const isNearBottom = rect.bottom + menuHeight + spacing * 2 > viewportHeight;
      setIsMenuAboveElement(isNearBottom);
      let top = isNearBottom ? rect.top + window.scrollY - menuHeight - spacing : rect.bottom + window.scrollY + spacing;
      let left = rect.left + rect.width / 2 - menuWidth / 2 + window.scrollX;
      if (isNearBottom && rect.top < menuHeight + spacing * 2) {
        const spaceRight = viewportWidth - rect.right;
        if (spaceRight >= menuWidth + spacing * 2) {
          top = rect.top + window.scrollY;
          left = rect.right + window.scrollX + spacing;
        } else {
          top = window.scrollY + spacing;
        }
      }
      left = Math.max(spacing, Math.min(left, viewportWidth - menuWidth - spacing));
      const arrowOffset = elementCenterX - left - window.scrollX;
      top = Math.max(spacing, top);
      setBubblePosition({
        top,
        left,
        // Keep arrow within menu bounds (spacing*2 to width-spacing*2)
        arrowOffset: Math.min(Math.max(spacing * 2, arrowOffset), menuWidth - spacing * 2)
      });
    };
    updateBubblePosition();
    window.addEventListener("resize", updateBubblePosition);
    window.addEventListener("scroll", updateBubblePosition);
    return () => {
      window.removeEventListener("resize", updateBubblePosition);
      window.removeEventListener("scroll", updateBubblePosition);
    };
  }, [selectedElements, menuHeight, menuWidth, spacing]);
  return { bubblePosition, isMenuAboveElement };
}

// src/hooks/useElementSelection.ts
var import_react5 = require("react");
function useElementSelection({ onElementsSelected } = {}) {
  const [hoveredElement, setHoveredElement] = (0, import_react5.useState)(null);
  const [selectedElements, setSelectedElements] = (0, import_react5.useState)([]);
  const handleElementHovered = (0, import_react5.useCallback)((element) => {
    setHoveredElement(element);
  }, []);
  const handleElementUnhovered = (0, import_react5.useCallback)(() => {
    setHoveredElement(null);
  }, []);
  const handleElementSelected = (0, import_react5.useCallback)((element) => {
    const isElementSelected = selectedElements.includes(element);
    if (isElementSelected) {
      const newSelectedElements = selectedElements.filter((el) => el !== element);
      setSelectedElements(newSelectedElements);
      onElementsSelected == null ? void 0 : onElementsSelected(newSelectedElements);
    } else {
      const newSelectedElements = [element];
      setSelectedElements(newSelectedElements);
      onElementsSelected == null ? void 0 : onElementsSelected(newSelectedElements);
    }
  }, [selectedElements, onElementsSelected]);
  const clearSelections = (0, import_react5.useCallback)(() => {
    setSelectedElements([]);
    onElementsSelected == null ? void 0 : onElementsSelected([]);
  }, [onElementsSelected]);
  return {
    hoveredElement,
    selectedElements,
    handleElementHovered,
    handleElementUnhovered,
    handleElementSelected,
    clearSelections
  };
}

// src/hooks/useIframeMessaging.ts
var import_react6 = require("react");
function useIframeMessaging() {
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  const sendSelectedElements = (0, import_react6.useCallback)((elements2) => {
    if (!isInIframe) return;
    window.parent.postMessage({
      type: "ELEMENT_INSPECTOR_SELECTED",
      payload: {
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
  }, [isInIframe]);
  const sendPrompt = (0, import_react6.useCallback)((prompt, elements2) => {
    if (!isInIframe) return;
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
  }, [isInIframe]);
  return {
    isInIframe,
    sendSelectedElements,
    sendPrompt
  };
}

// src/hooks/useInspector.ts
var import_react7 = require("react");
function useInspector({
  initialIsActive = true,
  onPromptGenerated
} = {}) {
  const [isInspecting, setIsInspecting] = (0, import_react7.useState)(initialIsActive);
  const [userPrompt, setUserPrompt] = (0, import_react7.useState)("");
  const toggleInspection = (0, import_react7.useCallback)(() => {
    setIsInspecting((prev) => !prev);
  }, []);
  (0, import_react7.useEffect)(() => {
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
  const generatePrompt = (0, import_react7.useCallback)((elements2, prompt) => {
    if (elements2.length === 0 || !prompt.trim()) return;
    const generatedPrompt = createElementsPrompt(elements2, prompt);
    const promptEvent = new CustomEvent("promptGenerated", {
      detail: { prompt: generatedPrompt, elements: elements2 }
    });
    document.dispatchEvent(promptEvent);
    onPromptGenerated == null ? void 0 : onPromptGenerated(generatedPrompt, elements2);
    setUserPrompt("");
  }, [onPromptGenerated]);
  const handlePromptSubmit = (0, import_react7.useCallback)((e, elements2) => {
    e.preventDefault();
    generatePrompt(elements2, userPrompt);
  }, [userPrompt, generatePrompt]);
  return {
    isInspecting,
    userPrompt,
    setUserPrompt,
    toggleInspection,
    handlePromptSubmit,
    generatePrompt
  };
}

// src/ElementInspector.tsx
var import_jsx_runtime7 = require("react/jsx-runtime");
function ElementInspector({
  initialIsActive = true,
  excludeSelector = ".element-inspector-bubble, .element-inspector-controls",
  elementLabel,
  selectorStyle,
  highlighterStyle
}) {
  const isDarkMode = useDarkMode();
  const { isInIframe, sendSelectedElements, sendPrompt } = useIframeMessaging();
  const {
    hoveredElement,
    selectedElements,
    handleElementHovered,
    handleElementUnhovered,
    handleElementSelected,
    clearSelections
  } = useElementSelection({
    onElementsSelected: (elements2) => {
      if (isInIframe) {
        sendSelectedElements(elements2);
      }
    }
  });
  const { bubblePosition, isMenuAboveElement } = useElementBubblePosition({
    selectedElements,
    menuHeight: 75,
    menuWidth: 300,
    spacing: 10
  });
  const {
    isInspecting,
    userPrompt,
    setUserPrompt,
    toggleInspection,
    handlePromptSubmit
  } = useInspector({
    initialIsActive,
    onPromptGenerated: (prompt, elements2) => {
      if (isInIframe) {
        sendPrompt(prompt, elements2);
      }
    }
  });
  const handleMenuToggle = (0, import_react8.useCallback)(() => {
    toggleInspection();
    if (isInspecting) {
      clearSelections();
    }
  }, [isInspecting, toggleInspection, clearSelections]);
  const onSubmitPrompt = (0, import_react8.useCallback)((e) => {
    handlePromptSubmit(e, selectedElements);
  }, [handlePromptSubmit, selectedElements]);
  const elementSelectorProps = {
    onElementHovered: handleElementHovered,
    onElementSelected: handleElementSelected,
    onElementUnhovered: handleElementUnhovered,
    ignoreList: selectedElements,
    excludeSelector,
    style: selectorStyle
  };
  return /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)("div", { children: [
    isInspecting && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
      /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ElementSelector, { ...elementSelectorProps }),
      hoveredElement && /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        ElementHighlighter,
        {
          element: hoveredElement,
          borderColor: "rgba(59, 130, 246, 0.8)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(hoveredElement) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ElementTagLabel, { element: hoveredElement })
        }
      ),
      selectedElements.map((element, index) => /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
        ElementHighlighter,
        {
          element,
          borderColor: "rgba(34, 197, 94, 0.8)",
          backgroundColor: "rgba(34, 197, 94, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(element) : /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(ElementTagLabel, { element })
        },
        `selected-${index}`
      ))
    ] }),
    /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(
      "div",
      {
        className: "element-inspector-bubble",
        style: {
          ...layout.bubble,
          position: "static"
          // The container doesn't need positioning
        },
        children: [
          isInspecting && selectedElements.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime7.jsxs)(import_jsx_runtime7.Fragment, { children: [
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "div",
              {
                style: {
                  ...elements.menuArrow,
                  top: isMenuAboveElement ? `${bubblePosition.top + 75}px` : `${bubblePosition.top - 8}px`,
                  // Arrow at top of menu
                  left: `${bubblePosition.left + bubblePosition.arrowOffset}px`,
                  borderTop: isMenuAboveElement ? `8px solid ${isDarkMode ? "#1f2937" : "white"}` : "none",
                  borderBottom: isMenuAboveElement ? "none" : `8px solid ${isDarkMode ? "#1f2937" : "white"}`,
                  pointerEvents: "none",
                  opacity: selectedElements.length > 0 ? 1 : 0
                },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
              "div",
              {
                className: "element-inspector-controls",
                style: {
                  ...layout.expandedMenu,
                  ...isDarkMode ? darkMode.expandedMenu : {},
                  padding: "16px",
                  position: "fixed",
                  top: `${bubblePosition.top}px`,
                  left: `${bubblePosition.left}px`,
                  zIndex: 1e4,
                  maxHeight: "400px",
                  overflowY: "auto"
                },
                children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
                  PromptForm,
                  {
                    userPrompt,
                    setUserPrompt,
                    handlePromptSubmit: onSubmitPrompt,
                    selectedElementsCount: selectedElements.length,
                    isDarkMode
                  }
                )
              }
            )
          ] }),
          /* @__PURE__ */ (0, import_jsx_runtime7.jsx)("div", { style: {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: 1e4
          }, children: /* @__PURE__ */ (0, import_jsx_runtime7.jsx)(
            BubbleMenuButton,
            {
              isInspecting,
              onClick: handleMenuToggle
            }
          ) })
        ]
      }
    )
  ] });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
//# sourceMappingURL=index.js.map