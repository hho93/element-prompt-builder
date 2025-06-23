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
import { jsx } from "react/jsx-runtime";
function ElementSelector({
  onElementHovered,
  onElementUnhovered,
  onElementSelected,
  ignoreList = [],
  excludeSelector = "",
  className = "",
  style = {},
  elementFilter
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
      if (elementFilter && !elementFilter(refElement)) {
        return;
      }
      if (lastHoveredElement.current !== refElement) {
        lastHoveredElement.current = refElement;
        onElementHovered(refElement);
      }
    },
    [onElementHovered, ignoreList, excludeSelector, elementFilter]
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
      if (elementFilter && !elementFilter(clickedElement)) {
        return;
      }
      lastHoveredElement.current = clickedElement;
      onElementSelected(clickedElement);
    },
    [onElementSelected, ignoreList, excludeSelector, elementFilter]
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
import { useCallback as useCallback6, useEffect as useEffect7 } from "react";

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
    width: "350px",
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
    minHeight: "65px",
    fontSize: "14px",
    outline: "none",
    fontFamily: "inherit",
    borderColor: "transparent",
    padding: 0,
    width: "100%"
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
import { jsx as jsx3, jsxs } from "react/jsx-runtime";
var IconSquareDashedPointer = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-square-dashed-mouse-pointer-icon lucide-square-dashed-mouse-pointer", children: [
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
var IconTick = () => /* @__PURE__ */ jsx3("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx3("polyline", { points: "20 6 9 17 4 12" }) });
var IconAi = () => /* @__PURE__ */ jsxs("svg", { width: "23", height: "23", viewBox: "0 0 23 23", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx3("path", { d: "M9.55507 5.34461L10.1322 6.94742C10.7733 8.72633 12.1742 10.1272 13.9531 10.7683L15.5559 11.3455C15.7004 11.3979 15.7004 11.6028 15.5559 11.6545L13.9531 12.2317C12.1742 12.8728 10.7733 14.2736 10.1322 16.0525L9.55507 17.6554C9.5026 17.7998 9.29776 17.7998 9.24601 17.6554L8.66885 16.0525C8.02772 14.2736 6.62688 12.8728 4.84797 12.2317L3.24516 11.6545C3.10069 11.602 3.10069 11.3972 3.24516 11.3455L4.84797 10.7683C6.62688 10.1272 8.02772 8.72633 8.66885 6.94742L9.24601 5.34461C9.29776 5.19942 9.5026 5.19942 9.55507 5.34461Z", fill: "black" }),
  /* @__PURE__ */ jsx3("path", { d: "M16.7699 1.49284L17.0624 2.30431C17.3873 3.2049 18.0967 3.91431 18.9973 4.23918L19.8088 4.53172C19.8821 4.55831 19.8821 4.66181 19.8088 4.6884L18.9973 4.98093C18.0967 5.30581 17.3873 6.01521 17.0624 6.91581L16.7699 7.72728C16.7433 7.80059 16.6398 7.80059 16.6132 7.72728L16.3207 6.91581C15.9958 6.01521 15.2864 5.30581 14.3858 4.98093L13.5743 4.6884C13.501 4.66181 13.501 4.55831 13.5743 4.53172L14.3858 4.23918C15.2864 3.91431 15.9958 3.2049 16.3207 2.30431L16.6132 1.49284C16.6398 1.41881 16.744 1.41881 16.7699 1.49284Z", fill: "black" }),
  /* @__PURE__ */ jsx3("path", { d: "M16.7699 15.2734L17.0624 16.0849C17.3873 16.9855 18.0967 17.6949 18.9973 18.0198L19.8088 18.3123C19.8821 18.3389 19.8821 18.4424 19.8088 18.469L18.9973 18.7615C18.0967 19.0864 17.3873 19.7958 17.0624 20.6964L16.7699 21.5079C16.7433 21.5812 16.6398 21.5812 16.6132 21.5079L16.3207 20.6964C15.9958 19.7958 15.2864 19.0864 14.3858 18.7615L13.5743 18.469C13.501 18.4424 13.501 18.3389 13.5743 18.3123L14.3858 18.0198C15.2864 17.6949 15.9958 16.9855 16.3207 16.0849L16.6132 15.2734C16.6398 15.2001 16.744 15.2001 16.7699 15.2734Z", fill: "black" })
] });

// src/components/BubbleMenuButton.tsx
import { jsx as jsx4 } from "react/jsx-runtime";
function BubbleMenuButton({
  isInspecting,
  onClick
}) {
  return /* @__PURE__ */ jsx4(
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
      children: /* @__PURE__ */ jsx4(IconSquareDashedPointer, {})
    }
  );
}

// src/components/ElementTagLabel.tsx
import { jsx as jsx5 } from "react/jsx-runtime";
function ElementTagLabel({ element }) {
  return /* @__PURE__ */ jsx5("div", { style: elements.elementTagLabel, children: element.tagName.toLowerCase() });
}

// src/components/PromptForm.tsx
import { jsx as jsx6, jsxs as jsxs2 } from "react/jsx-runtime";
function PromptForm({
  userPrompt,
  setUserPrompt,
  handlePromptSubmit,
  selectedElementsCount,
  isDarkMode
}) {
  return /* @__PURE__ */ jsx6("form", { onSubmit: handlePromptSubmit, children: /* @__PURE__ */ jsxs2(
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
        /* @__PURE__ */ jsxs2("div", { style: {
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
          gap: "5px",
          width: "100%"
        }, children: [
          /* @__PURE__ */ jsx6("div", { className: "mt-1", children: /* @__PURE__ */ jsx6(IconAi, {}) }),
          /* @__PURE__ */ jsx6(
            "textarea",
            {
              value: userPrompt,
              onChange: (e) => setUserPrompt(e.target.value),
              style: {
                ...inputs.promptInput,
                ...isDarkMode ? darkMode.promptInput : {},
                ...selectedElementsCount > 0 ? inputs.promptInputSelected : {},
                resize: "none",
                minHeight: "62px",
                // Height for approximately 3 lines
                lineHeight: "1.5"
              },
              placeholder: "Tell me how to modify this element...\nI can help change its style, content, or behavior."
            }
          )
        ] }),
        userPrompt.trim() !== "" && /* @__PURE__ */ jsx6(
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
            children: /* @__PURE__ */ jsx6(IconTick, {})
          }
        )
      ]
    }
  ) });
}

// src/constants.ts
var UI_CONSTANTS = {
  // Menu dimensions
  MENU_WIDTH: 350,
  // Width of the control menu in pixels
  MENU_HEIGHT: 94,
  // Height of the control menu in pixels
  // Spacing and offsets
  SPACING: 10,
  // Standard spacing for margins and padding
  ARROW_LEFT_OFFSET: 20,
  // Left offset for the arrow from menu edge
  // Z-index values
  Z_INDEX: 1e4
  // Standard z-index for UI elements
};

// src/hooks/useDarkMode.ts
import { useState, useEffect as useEffect2 } from "react";
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  useEffect2(() => {
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
import { useState as useState2, useEffect as useEffect3 } from "react";
function useElementBubblePosition({
  selectedElements,
  menuHeight = UI_CONSTANTS.MENU_HEIGHT,
  menuWidth = UI_CONSTANTS.MENU_WIDTH,
  spacing = UI_CONSTANTS.SPACING
}) {
  const [bubblePosition, setBubblePosition] = useState2({
    top: 0,
    left: 0,
    arrowOffset: UI_CONSTANTS.ARROW_LEFT_OFFSET
  });
  const [isMenuAboveElement, setIsMenuAboveElement] = useState2(false);
  useEffect3(() => {
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
      let left = rect.left + window.scrollX;
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
import { useState as useState3, useCallback as useCallback3, useEffect as useEffect4 } from "react";
function useElementSelection({ onElementsSelected } = {}) {
  const [hoveredElement, setHoveredElement] = useState3(null);
  const [selectedElements, setSelectedElements] = useState3([]);
  const handleElementHovered = useCallback3((element) => {
    setHoveredElement(element);
  }, []);
  const handleElementUnhovered = useCallback3(() => {
    setHoveredElement(null);
  }, []);
  const handleElementSelected = useCallback3((element) => {
    const isElementSelected = selectedElements.includes(element);
    if (isElementSelected) {
      element.removeAttribute("data-element-inspector-selected");
      const newSelectedElements = selectedElements.filter((el) => el !== element);
      setSelectedElements(newSelectedElements);
      onElementsSelected == null ? void 0 : onElementsSelected(newSelectedElements);
    } else {
      selectedElements.forEach((el) => {
        el.removeAttribute("data-element-inspector-selected");
      });
      element.setAttribute("data-element-inspector-selected", "true");
      const newSelectedElements = [element];
      setSelectedElements(newSelectedElements);
      onElementsSelected == null ? void 0 : onElementsSelected(newSelectedElements);
    }
  }, [selectedElements, onElementsSelected]);
  const clearSelections = useCallback3(() => {
    selectedElements.forEach((element) => {
      element.removeAttribute("data-element-inspector-selected");
    });
    setSelectedElements([]);
    onElementsSelected == null ? void 0 : onElementsSelected([]);
  }, [selectedElements, onElementsSelected]);
  useEffect4(() => {
    const handleClearSelections = () => {
      clearSelections();
    };
    document.addEventListener("clearElementSelections", handleClearSelections);
    return () => {
      document.removeEventListener("clearElementSelections", handleClearSelections);
    };
  }, [clearSelections]);
  useEffect4(() => {
    return () => {
      selectedElements.forEach((element) => {
        element.removeAttribute("data-element-inspector-selected");
      });
    };
  }, [selectedElements]);
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
import { useCallback as useCallback4, useEffect as useEffect5, useState as useState4 } from "react";
function useIframeMessaging() {
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  const [activeTab, setActiveTab] = useState4(null);
  const [shouldEnableInspect, setShouldEnableInspect] = useState4(!isInIframe);
  const [onlySelectButtons, setOnlySelectButtons] = useState4(false);
  useEffect5(() => {
    if (!isInIframe) return;
    const handleMessage = (event) => {
      var _a;
      if (((_a = event.data) == null ? void 0 : _a.type) === "TAB_CHANGED") {
        const { activeTab: newActiveTab } = event.data.payload || {};
        const previousTab = activeTab;
        setActiveTab(newActiveTab);
        if (newActiveTab === "chat") {
          setShouldEnableInspect(false);
        } else if (newActiveTab === "design" || newActiveTab === "workflow") {
          setShouldEnableInspect(true);
          const isWorkflowTab = newActiveTab === "workflow";
          setOnlySelectButtons(isWorkflowTab);
          if (isWorkflowTab && previousTab !== "workflow" && document.querySelectorAll('[data-element-inspector-selected="true"]').length > 0) {
            const selectedElements = Array.from(document.querySelectorAll('[data-element-inspector-selected="true"]'));
            const hasNonButtonSelected = selectedElements.some((element) => !isButtonElement(element));
            if (hasNonButtonSelected) {
              document.dispatchEvent(new CustomEvent("clearElementSelections"));
            }
          }
        }
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isInIframe, activeTab]);
  const isButtonElement = useCallback4((element) => {
    const isButtonElement2 = element.tagName.toLowerCase() === "button";
    const hasButtonRole = element.getAttribute("role") === "button";
    const hasButtonType = element.getAttribute("type") === "button" || element.getAttribute("type") === "submit" || element.getAttribute("type") === "reset";
    const classNames = element.className.toLowerCase();
    const hasButtonClass = classNames.includes("btn") || classNames.includes("button") || classNames.includes("-btn-") || classNames.includes("submit") || classNames.includes("action");
    const computedStyle = window.getComputedStyle(element);
    const hasCursorPointer = computedStyle.cursor === "pointer";
    const hasOnClickAttr = element.hasAttribute("onclick") || element.hasAttribute("ng-click") || element.hasAttribute("@click");
    return isButtonElement2 || hasButtonRole || hasButtonType || hasButtonClass || hasCursorPointer && hasOnClickAttr;
  }, []);
  const elementFilter = useCallback4((element) => {
    if (onlySelectButtons) {
      return isButtonElement(element);
    }
    return true;
  }, [onlySelectButtons, isButtonElement]);
  const sendSelectedElements = useCallback4((elements2) => {
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
  const sendPrompt = useCallback4((prompt, elements2) => {
    if (!isInIframe) return;
    window.parent.postMessage({
      type: "ELEMENT_INSPECTOR_PROMPT",
      payload: {
        prompt,
        activeTab,
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
  }, [isInIframe, activeTab]);
  return {
    isInIframe,
    sendSelectedElements,
    sendPrompt,
    activeTab,
    shouldEnableInspect,
    elementFilter,
    onlySelectButtons
  };
}

// src/hooks/useInspector.ts
import { useState as useState5, useCallback as useCallback5, useEffect as useEffect6 } from "react";
function useInspector({
  initialIsActive = true,
  onPromptGenerated
} = {}) {
  const [isInspecting, setIsInspecting] = useState5(initialIsActive);
  const [userPrompt, setUserPrompt] = useState5("");
  const toggleInspection = useCallback5(() => {
    setIsInspecting((prev) => !prev);
  }, []);
  useEffect6(() => {
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
  const generatePrompt = useCallback5((elements2, prompt) => {
    if (elements2.length === 0 || !prompt.trim()) return;
    const generatedPrompt = createElementsPrompt(elements2, prompt);
    const promptEvent = new CustomEvent("promptGenerated", {
      detail: { prompt: generatedPrompt, elements: elements2 }
    });
    document.dispatchEvent(promptEvent);
    onPromptGenerated == null ? void 0 : onPromptGenerated(generatedPrompt, elements2);
    setUserPrompt("");
  }, [onPromptGenerated]);
  const handlePromptSubmit = useCallback5((e, elements2) => {
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
import { Fragment, jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function ElementInspector({
  initialIsActive = true,
  excludeSelector = ".element-inspector-bubble, .element-inspector-controls",
  elementLabel,
  selectorStyle,
  highlighterStyle,
  showBubbleMenuButton = false
}) {
  const isDarkMode = useDarkMode();
  const {
    isInIframe,
    sendSelectedElements,
    sendPrompt,
    shouldEnableInspect,
    elementFilter
  } = useIframeMessaging();
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
    menuHeight: UI_CONSTANTS.MENU_HEIGHT,
    menuWidth: UI_CONSTANTS.MENU_WIDTH,
    spacing: UI_CONSTANTS.SPACING
  });
  const {
    isInspecting,
    userPrompt,
    setUserPrompt,
    toggleInspection,
    handlePromptSubmit
  } = useInspector({
    // Use shouldEnableInspect from iframe messaging if in iframe, otherwise use initialIsActive
    initialIsActive: isInIframe ? shouldEnableInspect : initialIsActive,
    onPromptGenerated: (prompt, elements2) => {
      if (isInIframe) {
        sendPrompt(prompt, elements2);
      }
    }
  });
  const handleMenuToggle = useCallback6(() => {
    toggleInspection();
    if (isInspecting) {
      clearSelections();
    }
  }, [isInspecting, toggleInspection, clearSelections]);
  const onSubmitPrompt = useCallback6((e) => {
    handlePromptSubmit(e, selectedElements);
  }, [handlePromptSubmit, selectedElements]);
  useEffect7(() => {
    if (isInIframe && isInspecting !== shouldEnableInspect) {
      toggleInspection();
    }
  }, [isInIframe, isInspecting, shouldEnableInspect, toggleInspection]);
  const elementSelectorProps = {
    onElementHovered: handleElementHovered,
    onElementSelected: handleElementSelected,
    onElementUnhovered: handleElementUnhovered,
    ignoreList: selectedElements,
    excludeSelector,
    style: selectorStyle,
    elementFilter: isInIframe ? elementFilter : void 0
    // Only apply filter when in iframe
  };
  return /* @__PURE__ */ jsxs3("div", { children: [
    isInspecting && /* @__PURE__ */ jsxs3(Fragment, { children: [
      /* @__PURE__ */ jsx7(ElementSelector, { ...elementSelectorProps }),
      hoveredElement && /* @__PURE__ */ jsx7(
        ElementHighlighter,
        {
          element: hoveredElement,
          borderColor: "rgba(59, 130, 246, 0.8)",
          backgroundColor: "rgba(59, 130, 246, 0.2)",
          style: highlighterStyle,
          children: elementLabel ? elementLabel(hoveredElement) : /* @__PURE__ */ jsx7(ElementTagLabel, { element: hoveredElement })
        }
      ),
      selectedElements.map((element, index) => {
        element.setAttribute("data-element-inspector-selected", "true");
        return /* @__PURE__ */ jsx7(
          ElementHighlighter,
          {
            element,
            borderColor: "rgba(34, 197, 94, 0.8)",
            backgroundColor: "rgba(34, 197, 94, 0.2)",
            style: highlighterStyle,
            children: elementLabel ? elementLabel(element) : /* @__PURE__ */ jsx7(ElementTagLabel, { element })
          },
          `selected-${index}`
        );
      })
    ] }),
    /* @__PURE__ */ jsxs3(
      "div",
      {
        className: "element-inspector-bubble",
        style: {
          ...layout.bubble,
          position: "static"
          // The container doesn't need positioning
        },
        children: [
          isInspecting && selectedElements.length > 0 && /* @__PURE__ */ jsxs3(Fragment, { children: [
            /* @__PURE__ */ jsx7(
              "div",
              {
                style: {
                  ...elements.menuArrow,
                  top: isMenuAboveElement ? `${bubblePosition.top + UI_CONSTANTS.MENU_HEIGHT}px` : `${bubblePosition.top - 8}px`,
                  // Arrow at top of menu
                  left: `${bubblePosition.left + UI_CONSTANTS.ARROW_LEFT_OFFSET}px`,
                  // Fixed left position with small offset from menu edge
                  borderTop: isMenuAboveElement ? `8px solid ${isDarkMode ? "#1f2937" : "white"}` : "none",
                  borderBottom: isMenuAboveElement ? "none" : `8px solid ${isDarkMode ? "#1f2937" : "white"}`,
                  pointerEvents: "none",
                  opacity: selectedElements.length > 0 ? 1 : 0
                },
                "aria-hidden": "true"
              }
            ),
            /* @__PURE__ */ jsx7(
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
                  zIndex: UI_CONSTANTS.Z_INDEX,
                  maxHeight: "400px",
                  overflowY: "auto"
                },
                children: /* @__PURE__ */ jsx7(
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
          showBubbleMenuButton && /* @__PURE__ */ jsx7("div", { style: {
            position: "fixed",
            bottom: "24px",
            right: "24px",
            zIndex: UI_CONSTANTS.Z_INDEX
          }, children: /* @__PURE__ */ jsx7(
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