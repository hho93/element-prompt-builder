// #style-inject:#style-inject
function styleInject(css, { insertAt } = {}) {
  if (!css || typeof document === "undefined") return;
  const head = document.head || document.getElementsByTagName("head")[0];
  const style = document.createElement("style");
  style.type = "text/css";
  if (insertAt === "top") {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }
  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

// src/styles/global.css
styleInject('/*! tailwindcss v4.1.10 | MIT License | https://tailwindcss.com */\n@layer properties;\n@layer theme, base, components, utilities;\n@layer theme {\n  :root,\n  :host {\n    --font-sans:\n      ui-sans-serif,\n      system-ui,\n      sans-serif,\n      "Apple Color Emoji",\n      "Segoe UI Emoji",\n      "Segoe UI Symbol",\n      "Noto Color Emoji";\n    --font-mono:\n      ui-monospace,\n      SFMono-Regular,\n      Menlo,\n      Monaco,\n      Consolas,\n      "Liberation Mono",\n      "Courier New",\n      monospace;\n    --color-blue-50: oklch(97% 0.014 254.604);\n    --color-blue-200: oklch(88.2% 0.059 254.128);\n    --color-blue-800: oklch(42.4% 0.199 265.638);\n    --color-blue-950: oklch(28.2% 0.091 267.935);\n    --color-gray-500: oklch(55.1% 0.027 264.364);\n    --color-gray-600: oklch(44.6% 0.03 256.802);\n    --color-black: #000;\n    --color-white: #fff;\n    --spacing: 0.25rem;\n    --text-xs: 0.75rem;\n    --text-xs--line-height: calc(1 / 0.75);\n    --text-sm: 0.875rem;\n    --text-sm--line-height: calc(1.25 / 0.875);\n    --text-base: 1rem;\n    --text-base--line-height: calc(1.5 / 1);\n    --font-weight-semibold: 600;\n    --radius-sm: 0.25rem;\n    --radius-md: 0.375rem;\n    --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);\n    --animate-spin: spin 1s linear infinite;\n    --default-transition-duration: 150ms;\n    --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);\n    --default-font-family: var(--font-sans);\n    --default-mono-font-family: var(--font-mono);\n  }\n}\n@layer base {\n  *,\n  ::after,\n  ::before,\n  ::backdrop,\n  ::file-selector-button {\n    box-sizing: border-box;\n    margin: 0;\n    padding: 0;\n    border: 0 solid;\n  }\n  html,\n  :host {\n    line-height: 1.5;\n    -webkit-text-size-adjust: 100%;\n    -moz-tab-size: 4;\n    -o-tab-size: 4;\n    tab-size: 4;\n    font-family: var(--default-font-family, ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji");\n    font-feature-settings: var(--default-font-feature-settings, normal);\n    font-variation-settings: var(--default-font-variation-settings, normal);\n    -webkit-tap-highlight-color: transparent;\n  }\n  hr {\n    height: 0;\n    color: inherit;\n    border-top-width: 1px;\n  }\n  abbr:where([title]) {\n    -webkit-text-decoration: underline dotted;\n    text-decoration: underline dotted;\n  }\n  h1,\n  h2,\n  h3,\n  h4,\n  h5,\n  h6 {\n    font-size: inherit;\n    font-weight: inherit;\n  }\n  a {\n    color: inherit;\n    -webkit-text-decoration: inherit;\n    text-decoration: inherit;\n  }\n  b,\n  strong {\n    font-weight: bolder;\n  }\n  code,\n  kbd,\n  samp,\n  pre {\n    font-family: var(--default-mono-font-family, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace);\n    font-feature-settings: var(--default-mono-font-feature-settings, normal);\n    font-variation-settings: var(--default-mono-font-variation-settings, normal);\n    font-size: 1em;\n  }\n  small {\n    font-size: 80%;\n  }\n  sub,\n  sup {\n    font-size: 75%;\n    line-height: 0;\n    position: relative;\n    vertical-align: baseline;\n  }\n  sub {\n    bottom: -0.25em;\n  }\n  sup {\n    top: -0.5em;\n  }\n  table {\n    text-indent: 0;\n    border-color: inherit;\n    border-collapse: collapse;\n  }\n  :-moz-focusring {\n    outline: auto;\n  }\n  progress {\n    vertical-align: baseline;\n  }\n  summary {\n    display: list-item;\n  }\n  ol,\n  ul,\n  menu {\n    list-style: none;\n  }\n  img,\n  svg,\n  video,\n  canvas,\n  audio,\n  iframe,\n  embed,\n  object {\n    display: block;\n    vertical-align: middle;\n  }\n  img,\n  video {\n    max-width: 100%;\n    height: auto;\n  }\n  button,\n  input,\n  select,\n  optgroup,\n  textarea,\n  ::file-selector-button {\n    font: inherit;\n    font-feature-settings: inherit;\n    font-variation-settings: inherit;\n    letter-spacing: inherit;\n    color: inherit;\n    border-radius: 0;\n    background-color: transparent;\n    opacity: 1;\n  }\n  :where(select:is([multiple], [size])) optgroup {\n    font-weight: bolder;\n  }\n  :where(select:is([multiple], [size])) optgroup option {\n    padding-inline-start: 20px;\n  }\n  ::file-selector-button {\n    margin-inline-end: 4px;\n  }\n  ::-moz-placeholder {\n    opacity: 1;\n  }\n  ::placeholder {\n    opacity: 1;\n  }\n  @supports (not (-webkit-appearance: -apple-pay-button)) or (contain-intrinsic-size: 1px) {\n    ::-moz-placeholder {\n      color: currentcolor;\n      @supports (color: color-mix(in lab, red, red)) {\n        color: color-mix(in oklab, currentcolor 50%, transparent);\n      }\n    }\n    ::placeholder {\n      color: currentcolor;\n      @supports (color: color-mix(in lab, red, red)) {\n        color: color-mix(in oklab, currentcolor 50%, transparent);\n      }\n    }\n  }\n  textarea {\n    resize: vertical;\n  }\n  ::-webkit-search-decoration {\n    -webkit-appearance: none;\n  }\n  ::-webkit-date-and-time-value {\n    min-height: 1lh;\n    text-align: inherit;\n  }\n  ::-webkit-datetime-edit {\n    display: inline-flex;\n  }\n  ::-webkit-datetime-edit-fields-wrapper {\n    padding: 0;\n  }\n  ::-webkit-datetime-edit,\n  ::-webkit-datetime-edit-year-field,\n  ::-webkit-datetime-edit-month-field,\n  ::-webkit-datetime-edit-day-field,\n  ::-webkit-datetime-edit-hour-field,\n  ::-webkit-datetime-edit-minute-field,\n  ::-webkit-datetime-edit-second-field,\n  ::-webkit-datetime-edit-millisecond-field,\n  ::-webkit-datetime-edit-meridiem-field {\n    padding-block: 0;\n  }\n  :-moz-ui-invalid {\n    box-shadow: none;\n  }\n  button,\n  input:where([type=button], [type=reset], [type=submit]),\n  ::file-selector-button {\n    -webkit-appearance: button;\n    -moz-appearance: button;\n    appearance: button;\n  }\n  ::-webkit-inner-spin-button,\n  ::-webkit-outer-spin-button {\n    height: auto;\n  }\n  [hidden]:where(:not([hidden=until-found])) {\n    display: none !important;\n  }\n}\n@layer utilities {\n  .visible {\n    visibility: visible;\n  }\n  .sr-only {\n    position: absolute;\n    width: 1px;\n    height: 1px;\n    padding: 0;\n    margin: -1px;\n    overflow: hidden;\n    clip: rect(0, 0, 0, 0);\n    white-space: nowrap;\n    border-width: 0;\n  }\n  .absolute {\n    position: absolute;\n  }\n  .fixed {\n    position: fixed;\n  }\n  .relative {\n    position: relative;\n  }\n  .static {\n    position: static;\n  }\n  .z-50 {\n    z-index: 50;\n  }\n  .z-\\[10001\\] {\n    z-index: 10001;\n  }\n  .container {\n    width: 100%;\n    @media (width >= 40rem) {\n      max-width: 40rem;\n    }\n    @media (width >= 48rem) {\n      max-width: 48rem;\n    }\n    @media (width >= 64rem) {\n      max-width: 64rem;\n    }\n    @media (width >= 80rem) {\n      max-width: 80rem;\n    }\n    @media (width >= 96rem) {\n      max-width: 96rem;\n    }\n  }\n  .mr-2 {\n    margin-right: calc(var(--spacing) * 2);\n  }\n  .ml-0 {\n    margin-left: calc(var(--spacing) * 0);\n  }\n  .block {\n    display: block;\n  }\n  .flex {\n    display: flex;\n  }\n  .field-sizing-content {\n    field-sizing: content;\n  }\n  .h-8 {\n    height: calc(var(--spacing) * 8);\n  }\n  .h-\\[200px\\] {\n    height: 200px;\n  }\n  .max-h-\\[200px\\] {\n    max-height: 200px;\n  }\n  .min-h-16 {\n    min-height: calc(var(--spacing) * 16);\n  }\n  .w-8 {\n    width: calc(var(--spacing) * 8);\n  }\n  .w-full {\n    width: 100%;\n  }\n  .max-w-\\[435px\\] {\n    max-width: 435px;\n  }\n  .min-w-\\[8rem\\] {\n    min-width: 8rem;\n  }\n  .min-w-\\[250px\\] {\n    min-width: 250px;\n  }\n  .transform {\n    transform: var(--tw-rotate-x,) var(--tw-rotate-y,) var(--tw-rotate-z,) var(--tw-skew-x,) var(--tw-skew-y,);\n  }\n  .animate-spin {\n    animation: var(--animate-spin);\n  }\n  .cursor-default {\n    cursor: default;\n  }\n  .resize {\n    resize: both;\n  }\n  .resize-none {\n    resize: none;\n  }\n  .flex-col {\n    flex-direction: column;\n  }\n  .items-center {\n    align-items: center;\n  }\n  .items-start {\n    align-items: flex-start;\n  }\n  .gap-0\\.5 {\n    gap: calc(var(--spacing) * 0.5);\n  }\n  .gap-2 {\n    gap: calc(var(--spacing) * 2);\n  }\n  .overflow-hidden {\n    overflow: hidden;\n  }\n  .overflow-y-auto {\n    overflow-y: auto;\n  }\n  .rounded-md {\n    border-radius: var(--radius-md);\n  }\n  .rounded-sm {\n    border-radius: var(--radius-sm);\n  }\n  .border {\n    border-style: var(--tw-border-style);\n    border-width: 1px;\n  }\n  .\\!border-none {\n    --tw-border-style: none !important;\n    border-style: none !important;\n  }\n  .border-none {\n    --tw-border-style: none;\n    border-style: none;\n  }\n  .bg-transparent {\n    background-color: transparent;\n  }\n  .bg-white {\n    background-color: var(--color-white);\n  }\n  .fill-black {\n    fill: var(--color-black);\n  }\n  .p-1 {\n    padding: calc(var(--spacing) * 1);\n  }\n  .px-0\\.5 {\n    padding-inline: calc(var(--spacing) * 0.5);\n  }\n  .px-1 {\n    padding-inline: calc(var(--spacing) * 1);\n  }\n  .px-2 {\n    padding-inline: calc(var(--spacing) * 2);\n  }\n  .px-3 {\n    padding-inline: calc(var(--spacing) * 3);\n  }\n  .px-4 {\n    padding-inline: calc(var(--spacing) * 4);\n  }\n  .py-1\\.5 {\n    padding-block: calc(var(--spacing) * 1.5);\n  }\n  .py-2 {\n    padding-block: calc(var(--spacing) * 2);\n  }\n  .py-3 {\n    padding-block: calc(var(--spacing) * 3);\n  }\n  .text-base {\n    font-size: var(--text-base);\n    line-height: var(--tw-leading, var(--text-base--line-height));\n  }\n  .text-sm {\n    font-size: var(--text-sm);\n    line-height: var(--tw-leading, var(--text-sm--line-height));\n  }\n  .text-xs {\n    font-size: var(--text-xs);\n    line-height: var(--tw-leading, var(--text-xs--line-height));\n  }\n  .text-\\[15px\\] {\n    font-size: 15px;\n  }\n  .font-semibold {\n    --tw-font-weight: var(--font-weight-semibold);\n    font-weight: var(--font-weight-semibold);\n  }\n  .\\!whitespace-nowrap {\n    white-space: nowrap !important;\n  }\n  .text-gray-500 {\n    color: var(--color-gray-500);\n  }\n  .text-white {\n    color: var(--color-white);\n  }\n  .\\!shadow-none {\n    --tw-shadow: 0 0 #0000 !important;\n    box-shadow:\n      var(--tw-inset-shadow),\n      var(--tw-inset-ring-shadow),\n      var(--tw-ring-offset-shadow),\n      var(--tw-ring-shadow),\n      var(--tw-shadow) !important;\n  }\n  .shadow-md {\n    --tw-shadow: 0 4px 6px -1px var(--tw-shadow-color, rgb(0 0 0 / 0.1)), 0 2px 4px -2px var(--tw-shadow-color, rgb(0 0 0 / 0.1));\n    box-shadow:\n      var(--tw-inset-shadow),\n      var(--tw-inset-ring-shadow),\n      var(--tw-ring-offset-shadow),\n      var(--tw-ring-shadow),\n      var(--tw-shadow);\n  }\n  .shadow-xs {\n    --tw-shadow: 0 1px 2px 0 var(--tw-shadow-color, rgb(0 0 0 / 0.05));\n    box-shadow:\n      var(--tw-inset-shadow),\n      var(--tw-inset-ring-shadow),\n      var(--tw-ring-offset-shadow),\n      var(--tw-ring-shadow),\n      var(--tw-shadow);\n  }\n  .\\!ring-0 {\n    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(0px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor) !important;\n    box-shadow:\n      var(--tw-inset-shadow),\n      var(--tw-inset-ring-shadow),\n      var(--tw-ring-offset-shadow),\n      var(--tw-ring-shadow),\n      var(--tw-shadow) !important;\n  }\n  .ring {\n    --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n    box-shadow:\n      var(--tw-inset-shadow),\n      var(--tw-inset-ring-shadow),\n      var(--tw-ring-offset-shadow),\n      var(--tw-ring-shadow),\n      var(--tw-shadow);\n  }\n  .outline-hidden {\n    --tw-outline-style: none;\n    outline-style: none;\n    @media (forced-colors: active) {\n      outline: 2px solid transparent;\n      outline-offset: 2px;\n    }\n  }\n  .outline {\n    outline-style: var(--tw-outline-style);\n    outline-width: 1px;\n  }\n  .transition {\n    transition-property:\n      color,\n      background-color,\n      border-color,\n      outline-color,\n      text-decoration-color,\n      fill,\n      stroke,\n      --tw-gradient-from,\n      --tw-gradient-via,\n      --tw-gradient-to,\n      opacity,\n      box-shadow,\n      transform,\n      translate,\n      scale,\n      rotate,\n      filter,\n      -webkit-backdrop-filter,\n      backdrop-filter,\n      display,\n      visibility,\n      content-visibility,\n      overlay,\n      pointer-events;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n  .transition-\\[color\\,box-shadow\\] {\n    transition-property: color, box-shadow;\n    transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));\n    transition-duration: var(--tw-duration, var(--default-transition-duration));\n  }\n  .ease-in-out {\n    --tw-ease: var(--ease-in-out);\n    transition-timing-function: var(--ease-in-out);\n  }\n  .outline-none {\n    --tw-outline-style: none;\n    outline-style: none;\n  }\n  .select-none {\n    -webkit-user-select: none;\n    -moz-user-select: none;\n    user-select: none;\n  }\n  .focus\\:outline-none {\n    &:focus {\n      --tw-outline-style: none;\n      outline-style: none;\n    }\n  }\n  .focus-visible\\:ring-1 {\n    &:focus-visible {\n      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(1px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n      box-shadow:\n        var(--tw-inset-shadow),\n        var(--tw-inset-ring-shadow),\n        var(--tw-ring-offset-shadow),\n        var(--tw-ring-shadow),\n        var(--tw-shadow);\n    }\n  }\n  .focus-visible\\:ring-\\[3px\\] {\n    &:focus-visible {\n      --tw-ring-shadow: var(--tw-ring-inset,) 0 0 0 calc(3px + var(--tw-ring-offset-width)) var(--tw-ring-color, currentcolor);\n      box-shadow:\n        var(--tw-inset-shadow),\n        var(--tw-inset-ring-shadow),\n        var(--tw-ring-offset-shadow),\n        var(--tw-ring-shadow),\n        var(--tw-shadow);\n    }\n  }\n  .focus-visible\\:outline-hidden {\n    &:focus-visible {\n      --tw-outline-style: none;\n      outline-style: none;\n      @media (forced-colors: active) {\n        outline: 2px solid transparent;\n        outline-offset: 2px;\n      }\n    }\n  }\n  .disabled\\:cursor-not-allowed {\n    &:disabled {\n      cursor: not-allowed;\n    }\n  }\n  .disabled\\:opacity-50 {\n    &:disabled {\n      opacity: 50%;\n    }\n  }\n  .data-disabled\\:pointer-events-none {\n    &[data-disabled] {\n      pointer-events: none;\n    }\n  }\n  .data-disabled\\:opacity-50 {\n    &[data-disabled] {\n      opacity: 50%;\n    }\n  }\n  .\\*\\*\\:data-tag\\:rounded {\n    :is(& *) {\n      &[data-tag] {\n        border-radius: 0.25rem;\n      }\n    }\n  }\n  .\\*\\*\\:data-tag\\:bg-blue-200 {\n    :is(& *) {\n      &[data-tag] {\n        background-color: var(--color-blue-200);\n      }\n    }\n  }\n  .\\*\\*\\:data-tag\\:py-px {\n    :is(& *) {\n      &[data-tag] {\n        padding-block: 1px;\n      }\n    }\n  }\n  .\\*\\*\\:data-tag\\:text-blue-950 {\n    :is(& *) {\n      &[data-tag] {\n        color: var(--color-blue-950);\n      }\n    }\n  }\n  .md\\:text-sm {\n    @media (width >= 48rem) {\n      font-size: var(--text-sm);\n      line-height: var(--tw-leading, var(--text-sm--line-height));\n    }\n  }\n  .dark\\:text-gray-600 {\n    @media (prefers-color-scheme: dark) {\n      color: var(--color-gray-600);\n    }\n  }\n  .dark\\:\\*\\*\\:data-tag\\:bg-blue-800 {\n    @media (prefers-color-scheme: dark) {\n      :is(& *) {\n        &[data-tag] {\n          background-color: var(--color-blue-800);\n        }\n      }\n    }\n  }\n  .dark\\:\\*\\*\\:data-tag\\:text-blue-50 {\n    @media (prefers-color-scheme: dark) {\n      :is(& *) {\n        &[data-tag] {\n          color: var(--color-blue-50);\n        }\n      }\n    }\n  }\n}\nbody span[data-tag] {\n  background-color: #ebf5fb !important;\n  color: #1566a4 !important;\n  border-radius: 4px !important;\n}\n@property --tw-rotate-x { syntax: "*"; inherits: false; }\n@property --tw-rotate-y { syntax: "*"; inherits: false; }\n@property --tw-rotate-z { syntax: "*"; inherits: false; }\n@property --tw-skew-x { syntax: "*"; inherits: false; }\n@property --tw-skew-y { syntax: "*"; inherits: false; }\n@property --tw-border-style { syntax: "*"; inherits: false; initial-value: solid; }\n@property --tw-font-weight { syntax: "*"; inherits: false; }\n@property --tw-shadow { syntax: "*"; inherits: false; initial-value: 0 0 #0000; }\n@property --tw-shadow-color { syntax: "*"; inherits: false; }\n@property --tw-shadow-alpha { syntax: "<percentage>"; inherits: false; initial-value: 100%; }\n@property --tw-inset-shadow { syntax: "*"; inherits: false; initial-value: 0 0 #0000; }\n@property --tw-inset-shadow-color { syntax: "*"; inherits: false; }\n@property --tw-inset-shadow-alpha { syntax: "<percentage>"; inherits: false; initial-value: 100%; }\n@property --tw-ring-color { syntax: "*"; inherits: false; }\n@property --tw-ring-shadow { syntax: "*"; inherits: false; initial-value: 0 0 #0000; }\n@property --tw-inset-ring-color { syntax: "*"; inherits: false; }\n@property --tw-inset-ring-shadow { syntax: "*"; inherits: false; initial-value: 0 0 #0000; }\n@property --tw-ring-inset { syntax: "*"; inherits: false; }\n@property --tw-ring-offset-width { syntax: "<length>"; inherits: false; initial-value: 0px; }\n@property --tw-ring-offset-color { syntax: "*"; inherits: false; initial-value: #fff; }\n@property --tw-ring-offset-shadow { syntax: "*"; inherits: false; initial-value: 0 0 #0000; }\n@property --tw-outline-style { syntax: "*"; inherits: false; initial-value: solid; }\n@property --tw-ease { syntax: "*"; inherits: false; }\n@keyframes spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n@layer properties {\n  @supports ((-webkit-hyphens: none) and (not (margin-trim: inline))) or ((-moz-orient: inline) and (not (color:rgb(from red r g b)))) {\n    *,\n    ::before,\n    ::after,\n    ::backdrop {\n      --tw-rotate-x: initial;\n      --tw-rotate-y: initial;\n      --tw-rotate-z: initial;\n      --tw-skew-x: initial;\n      --tw-skew-y: initial;\n      --tw-border-style: solid;\n      --tw-font-weight: initial;\n      --tw-shadow: 0 0 #0000;\n      --tw-shadow-color: initial;\n      --tw-shadow-alpha: 100%;\n      --tw-inset-shadow: 0 0 #0000;\n      --tw-inset-shadow-color: initial;\n      --tw-inset-shadow-alpha: 100%;\n      --tw-ring-color: initial;\n      --tw-ring-shadow: 0 0 #0000;\n      --tw-inset-ring-color: initial;\n      --tw-inset-ring-shadow: 0 0 #0000;\n      --tw-ring-inset: initial;\n      --tw-ring-offset-width: 0px;\n      --tw-ring-offset-color: #fff;\n      --tw-ring-offset-shadow: 0 0 #0000;\n      --tw-outline-style: solid;\n      --tw-ease: initial;\n    }\n  }\n}\n');

// src/ElementSelector.tsx
import { useCallback, useRef } from "react";

// src/utils.ts
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
function cn(...inputs2) {
  return twMerge(clsx(inputs2));
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

// src/styles/selector-styles.ts
var elementSelectorStyles = {
  overlay: {
    position: "fixed",
    inset: 0,
    height: "100vh",
    width: "100vw",
    cursor: "cell",
    zIndex: 9999,
    pointerEvents: "auto"
  }
};

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
        ...elementSelectorStyles.overlay,
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

// src/styles/highlighter-styles.ts
var getHighlighterStyles = (borderColor = "rgba(59, 130, 246, 0.8)", backgroundColor = "rgba(59, 130, 246, 0.2)", customStyles = {}) => {
  return {
    container: {
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
      ...customStyles
    }
  };
};

// src/ElementHighlighter.tsx
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
      style: getHighlighterStyles(borderColor, backgroundColor, style).container,
      ref: boxRef,
      children
    }
  );
}

// src/ElementInspector.tsx
import { useCallback as useCallback7, useEffect as useEffect8 } from "react";

// src/constants.ts
var UI_CONSTANTS = {
  // Menu dimensions
  MENU_WIDTH: 350,
  // Width of the control menu in pixels
  MENU_HEIGHT: 56,
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

// src/styles/bubble-menu-styles.ts
var getMenuArrowStyles = (isMenuAboveElement, bubblePosition, isDarkMode, isVisible) => {
  const topPosition = isMenuAboveElement ? `${bubblePosition.top + UI_CONSTANTS.MENU_HEIGHT}px` : `${bubblePosition.top - 8}px`;
  const leftPosition = `${bubblePosition.left + UI_CONSTANTS.ARROW_LEFT_OFFSET}px`;
  const borderTop = isMenuAboveElement ? `8px solid ${isDarkMode ? "#1f2937" : "white"}` : "none";
  const borderBottom = isMenuAboveElement ? "none" : `8px solid ${isDarkMode ? "#1f2937" : "white"}`;
  return {
    menuArrow: {
      position: "fixed",
      width: 0,
      height: 0,
      borderLeft: "8px solid transparent",
      borderRight: "8px solid transparent",
      top: topPosition,
      left: leftPosition,
      borderTop,
      borderBottom,
      pointerEvents: "none",
      opacity: isVisible ? 1 : 0,
      zIndex: UI_CONSTANTS.Z_INDEX + 1
    }
  };
};
var floatingButtonStyles = {
  container: {
    position: "fixed",
    bottom: "24px",
    right: "24px",
    zIndex: UI_CONSTANTS.Z_INDEX
  }
};

// src/components/bubble-menu/MenuArrow.tsx
import { jsx as jsx3 } from "react/jsx-runtime";
var MenuArrow = ({
  isMenuAboveElement,
  bubblePosition,
  isDarkMode,
  isVisible
}) => {
  const styles = getMenuArrowStyles(
    isMenuAboveElement,
    bubblePosition,
    isDarkMode,
    isVisible
  );
  return /* @__PURE__ */ jsx3(
    "div",
    {
      className: "element-inspector-menu-arrow",
      style: styles.menuArrow,
      "aria-hidden": "true"
    }
  );
};

// src/Icons.tsx
import { jsx as jsx4, jsxs } from "react/jsx-runtime";
var IconSquareDashedPointer = () => /* @__PURE__ */ jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "lucide lucide-square-dashed-mouse-pointer-icon lucide-square-dashed-mouse-pointer", children: [
  /* @__PURE__ */ jsx4("path", { d: "M12.034 12.681a.498.498 0 0 1 .647-.647l9 3.5a.5.5 0 0 1-.033.943l-3.444 1.068a1 1 0 0 0-.66.66l-1.067 3.443a.5.5 0 0 1-.943.033z" }),
  /* @__PURE__ */ jsx4("path", { d: "M5 3a2 2 0 0 0-2 2" }),
  /* @__PURE__ */ jsx4("path", { d: "M19 3a2 2 0 0 1 2 2" }),
  /* @__PURE__ */ jsx4("path", { d: "M5 21a2 2 0 0 1-2-2" }),
  /* @__PURE__ */ jsx4("path", { d: "M9 3h1" }),
  /* @__PURE__ */ jsx4("path", { d: "M9 21h2" }),
  /* @__PURE__ */ jsx4("path", { d: "M14 3h1" }),
  /* @__PURE__ */ jsx4("path", { d: "M3 9v1" }),
  /* @__PURE__ */ jsx4("path", { d: "M21 9v2" }),
  /* @__PURE__ */ jsx4("path", { d: "M3 14v1" })
] });
var IconTick = () => /* @__PURE__ */ jsx4("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx4("polyline", { points: "20 6 9 17 4 12" }) });
var IconAi = () => /* @__PURE__ */ jsxs("svg", { width: "23", height: "23", viewBox: "0 0 23 23", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [
  /* @__PURE__ */ jsx4("path", { d: "M9.55507 5.34461L10.1322 6.94742C10.7733 8.72633 12.1742 10.1272 13.9531 10.7683L15.5559 11.3455C15.7004 11.3979 15.7004 11.6028 15.5559 11.6545L13.9531 12.2317C12.1742 12.8728 10.7733 14.2736 10.1322 16.0525L9.55507 17.6554C9.5026 17.7998 9.29776 17.7998 9.24601 17.6554L8.66885 16.0525C8.02772 14.2736 6.62688 12.8728 4.84797 12.2317L3.24516 11.6545C3.10069 11.602 3.10069 11.3972 3.24516 11.3455L4.84797 10.7683C6.62688 10.1272 8.02772 8.72633 8.66885 6.94742L9.24601 5.34461C9.29776 5.19942 9.5026 5.19942 9.55507 5.34461Z", fill: "black" }),
  /* @__PURE__ */ jsx4("path", { d: "M16.7699 1.49284L17.0624 2.30431C17.3873 3.2049 18.0967 3.91431 18.9973 4.23918L19.8088 4.53172C19.8821 4.55831 19.8821 4.66181 19.8088 4.6884L18.9973 4.98093C18.0967 5.30581 17.3873 6.01521 17.0624 6.91581L16.7699 7.72728C16.7433 7.80059 16.6398 7.80059 16.6132 7.72728L16.3207 6.91581C15.9958 6.01521 15.2864 5.30581 14.3858 4.98093L13.5743 4.6884C13.501 4.66181 13.501 4.55831 13.5743 4.53172L14.3858 4.23918C15.2864 3.91431 15.9958 3.2049 16.3207 2.30431L16.6132 1.49284C16.6398 1.41881 16.744 1.41881 16.7699 1.49284Z", fill: "black" }),
  /* @__PURE__ */ jsx4("path", { d: "M16.7699 15.2734L17.0624 16.0849C17.3873 16.9855 18.0967 17.6949 18.9973 18.0198L19.8088 18.3123C19.8821 18.3389 19.8821 18.4424 19.8088 18.469L18.9973 18.7615C18.0967 19.0864 17.3873 19.7958 17.0624 20.6964L16.7699 21.5079C16.7433 21.5812 16.6398 21.5812 16.6132 21.5079L16.3207 20.6964C15.9958 19.7958 15.2864 19.0864 14.3858 18.7615L13.5743 18.469C13.501 18.4424 13.501 18.3389 13.5743 18.3123L14.3858 18.0198C15.2864 17.6949 15.9958 16.9855 16.3207 16.0849L16.6132 15.2734C16.6398 15.2001 16.744 15.2001 16.7699 15.2734Z", fill: "black" })
] });

// src/styles/base-styles.ts
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

// src/styles/form-styles.ts
var formContainerStyles = {
  wrapper: {
    display: "flex",
    flexDirection: "row",
    gap: "8px",
    alignItems: "center",
    width: "100%"
  },
  inputWrapper: {
    display: "flex",
    alignItems: "center",
    position: "relative",
    gap: "5px",
    width: "100%"
  }
};
var submitButtonStyles = {
  button: {
    ...buttons.submitButton,
    borderRadius: "50%",
    padding: "5px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  hoverBackgroundColor: buttons.submitButtonHover.backgroundColor,
  normalBackgroundColor: buttons.submitButton.backgroundColor
};

// src/components/MentionChat.tsx
import {
  useEffect as useEffect2,
  useRef as useRef3,
  useState
} from "react";

// src/stores/workflows.ts
import { create } from "zustand";
var useWorkflowsStore = create()((set, get2) => ({
  // Initial state
  workflows: [],
  workflowId: "",
  // Actions to update workflows state
  setWorkflowId: (workflowId) => set({ workflowId }),
  setWorkflows: (data) => set({
    workflows: data
  }),
  getworkflows: () => {
    return get2().workflows;
  }
}));

// src/components/Mapper.tsx
import get from "lodash/get";
import map from "lodash/map";
import size from "lodash/size";
import React3 from "react";
import isEmpty from "lodash/isEmpty";
import { jsx as jsx5 } from "react/jsx-runtime";
var Mapper = ({
  children,
  data: items = [],
  extractedKey,
  isShowEmpty = false
}) => {
  return /* @__PURE__ */ jsx5(React3.Fragment, { children: !isEmpty(items) ? map(items, (item, index) => /* @__PURE__ */ jsx5(
    React3.Fragment,
    {
      children: children(item, {
        index: +index,
        firstItem: +index === 0,
        lastItem: size(items) - 1 === +index,
        isOdd: +index % 2 !== 0
      })
    },
    extractedKey ? get(item, extractedKey, index) : index
  )) : isShowEmpty && /* @__PURE__ */ jsx5("p", { className: "px-4 py-3 text-[15px] text-gray-500", children: "No data found." }) });
};
var Mapper_default = Mapper;

// src/components/ui/mention.tsx
import * as MentionPrimitive from "@diceui/mention";
import * as React4 from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
var Mention = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  MentionPrimitive.Root,
  {
    "data-slot": "mention",
    ref,
    className: cn(
      "**:data-tag:rounded **:data-tag:bg-blue-200 **:data-tag:py-px **:data-tag:text-blue-950 dark:**:data-tag:bg-blue-800 dark:**:data-tag:text-blue-50",
      className
    ),
    ...props
  }
));
Mention.displayName = MentionPrimitive.Root.displayName;
var MentionLabel = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  MentionPrimitive.Label,
  {
    "data-slot": "mention-label",
    ref,
    className: cn("px-0.5 py-1.5 font-semibold text-sm", className),
    ...props
  }
));
MentionLabel.displayName = MentionPrimitive.Label.displayName;
var MentionInput = React4.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx6(
  MentionPrimitive.Input,
  {
    "data-slot": "mention-input",
    ref,
    className: cn(
      "flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
      className
    ),
    ...props
  }
));
MentionInput.displayName = MentionPrimitive.Input.displayName;
var MentionContent = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx6(MentionPrimitive.Portal, { children: /* @__PURE__ */ jsx6(
  MentionPrimitive.Content,
  {
    "data-slot": "mention-content",
    ref,
    className: cn(
      "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 relative z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in",
      className
    ),
    ...props,
    children
  }
) }));
MentionContent.displayName = MentionPrimitive.Content.displayName;
var MentionItem = React4.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ jsx6(
  MentionPrimitive.Item,
  {
    "data-slot": "mention-item",
    ref,
    className: cn(
      "relative flex w-full cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-disabled:pointer-events-none data-highlighted:bg-accent data-highlighted:text-accent-foreground data-disabled:opacity-50",
      className
    ),
    ...props,
    children
  }
));
MentionItem.displayName = MentionPrimitive.Item.displayName;

// src/components/MentionChat.tsx
import { jsx as jsx7, jsxs as jsxs2 } from "react/jsx-runtime";
var MentionChat = ({
  showWorkbench = false,
  handleInputChange,
  style,
  textAreaClassName = "",
  mentionContentClassName = ""
}) => {
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  const mentionInputRef = useRef3(null);
  const [values, setValues] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const workflows = useWorkflowsStore.getState().workflows || [];
  useEffect2(() => {
    handleInputChange == null ? void 0 : handleInputChange(inputValue);
    if (values.length > 0) {
      useWorkflowsStore.getState().setWorkflowId(values[0]);
    }
  }, [inputValue, values]);
  useEffect2(() => {
    if (isInIframe) {
      window.parent.postMessage(
        {
          type: "ELEMENT_INSPECTOR_MENTIONED",
          payload: { workflowId: values == null ? void 0 : values[0] }
        },
        "*"
      );
    }
  }, [isInIframe, values]);
  useEffect2(() => {
    var _a, _b, _c;
    if (!mentionInputRef.current) return;
    (_c = (_b = (_a = mentionInputRef.current.parentElement) == null ? void 0 : _a.querySelector("div")) == null ? void 0 : _b.classList) == null ? void 0 : _c.add("!whitespace-nowrap");
  }, [mentionInputRef.current]);
  useEffect2(() => {
    if (inputValue) return;
    setValues([]);
  }, [inputValue]);
  return /* @__PURE__ */ jsxs2(
    Mention,
    {
      trigger: "@",
      className: cn(
        "w-full focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent",
        {
          "max-w-[435px] ml-0": showWorkbench
        },
        "element-inspector-mention"
      ),
      inputValue,
      value: values,
      onInputValueChange: setInputValue,
      onValueChange: setValues,
      children: [
        /* @__PURE__ */ jsx7(
          MentionInput,
          {
            value: inputValue,
            ref: mentionInputRef,
            placeholder: "Tell me how to modify this element...",
            className: cn(
              "!shadow-none !ring-0 !border-none w-full focus:outline-none text-sm text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent px-1",
              {
                "max-w-[435px] ml-0": showWorkbench
              },
              textAreaClassName
            ),
            style: { ...style, resize: "none" }
          }
        ),
        values.length === 0 && /* @__PURE__ */ jsx7(MentionContent, { className: cn("max-h-[200px] h-[200px] min-w-[250px] overflow-y-auto relative border-none outline-none bg-white", mentionContentClassName), style: { zIndex: 10001 }, children: /* @__PURE__ */ jsx7(Mapper_default, { data: workflows, extractedKey: "id", children: (item) => /* @__PURE__ */ jsxs2(
          MentionItem,
          {
            value: item.id,
            label: item.name,
            className: "flex-col items-start gap-0.5",
            disabled: values.length > 0 && !values.includes(item.id),
            children: [
              /* @__PURE__ */ jsx7("p", { className: "text-sm", children: item.name }),
              /* @__PURE__ */ jsx7("p", { className: "text-xs text-gray-500", children: item.id })
            ]
          },
          item.id
        ) }) })
      ]
    }
  );
};

// src/components/PromptForm.tsx
import { jsx as jsx8, jsxs as jsxs3 } from "react/jsx-runtime";
function PromptForm({
  userPrompt,
  setUserPrompt,
  handlePromptSubmit,
  selectedElementsCount,
  isDarkMode
}) {
  return /* @__PURE__ */ jsx8("form", { onSubmit: handlePromptSubmit, children: /* @__PURE__ */ jsxs3("div", { style: formContainerStyles.wrapper, children: [
    /* @__PURE__ */ jsxs3("div", { style: formContainerStyles.inputWrapper, children: [
      /* @__PURE__ */ jsx8(IconAi, {}),
      /* @__PURE__ */ jsx8(
        MentionChat,
        {
          handleInputChange: setUserPrompt,
          textAreaClassName: "text-sm resize-none"
        }
      )
    ] }),
    userPrompt.trim() !== "" && /* @__PURE__ */ jsx8(
      "button",
      {
        type: "submit",
        style: submitButtonStyles.button,
        onMouseOver: (e) => {
          e.currentTarget.style.backgroundColor = submitButtonStyles.hoverBackgroundColor;
        },
        onMouseOut: (e) => {
          e.currentTarget.style.backgroundColor = submitButtonStyles.normalBackgroundColor;
        },
        children: /* @__PURE__ */ jsx8(IconTick, {})
      }
    )
  ] }) });
}

// src/styles/expanded-menu-styles.ts
var getExpandedMenuStyles = (top, left, isDarkMode) => {
  return {
    container: {
      ...layout.expandedMenu,
      ...isDarkMode ? darkMode.expandedMenu : {},
      padding: "10px 8px",
      position: "fixed",
      // Use fixed to stay consistent with scroll position
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 1e4,
      maxHeight: "400px",
      // Ensure it doesn't get too large
      overflowY: "auto"
      // Add scrolling if needed
    }
  };
};

// src/components/bubble-menu/ExpandedMenu.tsx
import { jsx as jsx9 } from "react/jsx-runtime";
var ExpandedMenu = ({
  bubblePosition,
  userPrompt,
  setUserPrompt,
  onSubmitPrompt,
  selectedElementsCount,
  isDarkMode
}) => {
  const styles = getExpandedMenuStyles(bubblePosition.top, bubblePosition.left, isDarkMode);
  return /* @__PURE__ */ jsx9("div", { className: "element-inspector-controls", style: styles.container, children: /* @__PURE__ */ jsx9(
    PromptForm,
    {
      userPrompt,
      setUserPrompt,
      handlePromptSubmit: onSubmitPrompt,
      selectedElementsCount,
      isDarkMode
    }
  ) });
};

// src/styles/bubble-button-styles.ts
var getBubbleMenuButtonStyles = (isInspecting) => {
  return {
    button: {
      ...buttons.mainButton,
      backgroundColor: isInspecting ? "#2563eb" : "#93c5fd",
      // Lighter blue when not enabled
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)"
    },
    hoverBackgroundColor: isInspecting ? "#1d4ed8" : "#60a5fa",
    // Darker on hover but still lighter than active
    normalBackgroundColor: isInspecting ? "#2563eb" : "#93c5fd"
  };
};

// src/components/BubbleMenuButton.tsx
import { jsx as jsx10 } from "react/jsx-runtime";
function BubbleMenuButton({
  isInspecting,
  onClick
}) {
  const title = isInspecting ? "Disable Element Inspector" : "Enable Element Inspector";
  const styles = getBubbleMenuButtonStyles(isInspecting);
  const handleMouseOver = (e) => {
    e.currentTarget.style.backgroundColor = styles.hoverBackgroundColor;
  };
  const handleMouseOut = (e) => {
    e.currentTarget.style.backgroundColor = styles.normalBackgroundColor;
  };
  return /* @__PURE__ */ jsx10(
    "button",
    {
      onClick,
      style: styles.button,
      onMouseOver: handleMouseOver,
      onMouseOut: handleMouseOut,
      title,
      children: /* @__PURE__ */ jsx10(IconSquareDashedPointer, {})
    }
  );
}

// src/components/bubble-menu/FloatingButton.tsx
import { jsx as jsx11 } from "react/jsx-runtime";
var FloatingButton = ({
  isInspecting,
  onToggle
}) => {
  return /* @__PURE__ */ jsx11(
    "div",
    {
      className: "element-inspector-floating-button-container",
      style: floatingButtonStyles.container,
      children: /* @__PURE__ */ jsx11(BubbleMenuButton, { isInspecting, onClick: onToggle })
    }
  );
};

// src/components/bubble-menu/BubbleMenu.tsx
import { Fragment, jsx as jsx12, jsxs as jsxs4 } from "react/jsx-runtime";
var BubbleMenu = ({
  isInspecting,
  selectedElements,
  bubblePosition,
  isMenuAboveElement,
  userPrompt,
  setUserPrompt,
  onSubmitPrompt,
  onToggleInspection,
  isDarkMode,
  showBubbleMenuButton
}) => {
  const showMenu = isInspecting && selectedElements.length > 0;
  return /* @__PURE__ */ jsxs4("div", { className: "element-inspector-bubble", children: [
    showMenu && /* @__PURE__ */ jsxs4(Fragment, { children: [
      /* @__PURE__ */ jsx12(
        MenuArrow,
        {
          isMenuAboveElement,
          bubblePosition,
          isDarkMode,
          isVisible: selectedElements.length > 0
        }
      ),
      /* @__PURE__ */ jsx12(
        ExpandedMenu,
        {
          bubblePosition,
          userPrompt,
          setUserPrompt,
          onSubmitPrompt,
          selectedElementsCount: selectedElements.length,
          isDarkMode
        }
      )
    ] }),
    showBubbleMenuButton && /* @__PURE__ */ jsx12(
      FloatingButton,
      {
        isInspecting,
        onToggle: onToggleInspection
      }
    )
  ] });
};

// src/components/ElementTagLabel.tsx
import { jsx as jsx13 } from "react/jsx-runtime";
function ElementTagLabel({ element }) {
  return /* @__PURE__ */ jsx13("div", { style: elements.elementTagLabel, children: element.tagName.toLowerCase() });
}

// src/styles/highlights-styles.ts
var hoveredElementStyles = {
  highlighter: {
    borderColor: "rgba(59, 130, 246, 0.8)",
    backgroundColor: "rgba(59, 130, 246, 0.2)"
  }
};
var selectedElementStyles = {
  highlighter: {
    borderColor: "rgba(34, 197, 94, 0.8)",
    backgroundColor: "rgba(34, 197, 94, 0.2)"
  }
};

// src/components/highlights/HoveredElement.tsx
import { jsx as jsx14 } from "react/jsx-runtime";
var HoveredElement = ({
  hoveredElement,
  elementLabel,
  highlighterStyle
}) => {
  if (!hoveredElement) return null;
  return /* @__PURE__ */ jsx14(
    ElementHighlighter,
    {
      element: hoveredElement,
      borderColor: hoveredElementStyles.highlighter.borderColor,
      backgroundColor: hoveredElementStyles.highlighter.backgroundColor,
      style: highlighterStyle,
      children: elementLabel ? elementLabel(hoveredElement) : /* @__PURE__ */ jsx14(ElementTagLabel, { element: hoveredElement })
    }
  );
};

// src/components/highlights/SelectedElements.tsx
import { Fragment as Fragment2, jsx as jsx15 } from "react/jsx-runtime";
var SelectedElements = ({
  selectedElements,
  elementLabel,
  highlighterStyle
}) => {
  return /* @__PURE__ */ jsx15(Fragment2, { children: selectedElements.map((element, index) => {
    element.setAttribute("data-element-inspector-selected", "true");
    return /* @__PURE__ */ jsx15(
      ElementHighlighter,
      {
        element,
        borderColor: selectedElementStyles.highlighter.borderColor,
        backgroundColor: selectedElementStyles.highlighter.backgroundColor,
        style: highlighterStyle,
        children: elementLabel ? elementLabel(element) : /* @__PURE__ */ jsx15(ElementTagLabel, { element })
      },
      `selected-${index}`
    );
  }) });
};

// src/components/InspectionOverlay.tsx
import { Fragment as Fragment3, jsx as jsx16, jsxs as jsxs5 } from "react/jsx-runtime";
var InspectionOverlay = ({
  isInspecting,
  hoveredElement,
  selectedElements,
  onElementHovered,
  onElementSelected,
  onElementUnhovered,
  excludeSelector,
  selectorStyle,
  highlighterStyle,
  elementLabel
}) => {
  if (!isInspecting) return null;
  return /* @__PURE__ */ jsxs5(Fragment3, { children: [
    /* @__PURE__ */ jsx16(
      ElementSelector,
      {
        onElementHovered,
        onElementSelected,
        onElementUnhovered,
        ignoreList: selectedElements,
        excludeSelector,
        style: selectorStyle
      }
    ),
    /* @__PURE__ */ jsx16(
      HoveredElement,
      {
        hoveredElement,
        elementLabel,
        highlighterStyle
      }
    ),
    /* @__PURE__ */ jsx16(
      SelectedElements,
      {
        selectedElements,
        elementLabel,
        highlighterStyle
      }
    )
  ] });
};

// src/hooks/useDarkMode.ts
import { useState as useState2, useEffect as useEffect3 } from "react";
function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState2(false);
  useEffect3(() => {
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
import { useState as useState3, useEffect as useEffect4 } from "react";
function useElementBubblePosition({
  selectedElements,
  menuHeight = UI_CONSTANTS.MENU_HEIGHT,
  menuWidth = UI_CONSTANTS.MENU_WIDTH,
  spacing = UI_CONSTANTS.SPACING
}) {
  const [bubblePosition, setBubblePosition] = useState3({
    top: 0,
    left: 0,
    arrowOffset: UI_CONSTANTS.ARROW_LEFT_OFFSET
  });
  const [isMenuAboveElement, setIsMenuAboveElement] = useState3(false);
  useEffect4(() => {
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
      const scrolledPixels = window.scrollY || window.pageYOffset;
      top = Math.max(spacing, top) - scrolledPixels;
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
import { useState as useState4, useCallback as useCallback4, useEffect as useEffect5 } from "react";
function useElementSelection({ onElementsSelected } = {}) {
  const [hoveredElement, setHoveredElement] = useState4(null);
  const [selectedElements, setSelectedElements] = useState4([]);
  const handleElementHovered = useCallback4((element) => {
    setHoveredElement(element);
  }, []);
  const handleElementUnhovered = useCallback4(() => {
    setHoveredElement(null);
  }, []);
  const handleElementSelected = useCallback4((element) => {
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
  const clearSelections = useCallback4(() => {
    selectedElements.forEach((element) => {
      element.removeAttribute("data-element-inspector-selected");
    });
    setSelectedElements([]);
    onElementsSelected == null ? void 0 : onElementsSelected([]);
  }, [selectedElements, onElementsSelected]);
  useEffect5(() => {
    const handleClearSelections = () => {
      clearSelections();
    };
    document.addEventListener("clearElementSelections", handleClearSelections);
    return () => {
      document.removeEventListener("clearElementSelections", handleClearSelections);
    };
  }, [clearSelections]);
  useEffect5(() => {
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
import { useCallback as useCallback5, useEffect as useEffect6, useState as useState5 } from "react";
var extractElementProperties = (el) => {
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
};
var getAllFormElements = () => {
  const formElements = Array.from(
    document.querySelectorAll(
      '[data-name$="-select"], [data-name$="-input"], [data-name$="-checkbox"], [data-name$="-radio"], [data-name$="-textarea"]'
    )
  ).filter((formEl) => formEl instanceof HTMLElement);
  const dataNames = formElements.map((el) => el.getAttribute("data-name") || "");
  return dataNames.filter(Boolean);
};
function useIframeMessaging() {
  const isInIframe = typeof window !== "undefined" && window.self !== window.top;
  const [activeTab, setActiveTab] = useState5(null);
  const [shouldEnableInspect, setShouldEnableInspect] = useState5(!isInIframe);
  useEffect6(() => {
    if (!isInIframe) return;
    const handleMessage = (event) => {
      var _a, _b;
      if (((_a = event.data) == null ? void 0 : _a.type) === "TAB_CHANGED") {
        const { activeTab: newActiveTab } = event.data.payload || {};
        setActiveTab(newActiveTab);
        if (newActiveTab === "chat") {
          setShouldEnableInspect(false);
        } else if (newActiveTab === "design" || newActiveTab === "workflow") {
          setShouldEnableInspect(true);
        }
      } else if (((_b = event.data) == null ? void 0 : _b.type) === "WORKFLOW_LIST") {
        useWorkflowsStore.getState().setWorkflows(event.data.workflows);
      }
    };
    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [isInIframe, activeTab]);
  const sendSelectedElements = useCallback5((elements2) => {
    if (!isInIframe) return;
    window.parent.postMessage({
      type: "ELEMENT_INSPECTOR_SELECTED",
      payload: {
        referenceInputs: getAllFormElements(),
        elements: elements2.map((el) => extractElementProperties(el))
      }
    }, "*");
  }, [isInIframe]);
  const sendPrompt = useCallback5((prompt, elements2) => {
    if (!isInIframe) return;
    window.parent.postMessage({
      type: "ELEMENT_INSPECTOR_PROMPT",
      payload: {
        workflowId: useWorkflowsStore.getState().workflowId,
        prompt,
        activeTab,
        referenceInputs: getAllFormElements(),
        elements: elements2.map((el) => extractElementProperties(el))
      }
    }, "*");
  }, [isInIframe, activeTab]);
  return {
    isInIframe,
    sendSelectedElements,
    sendPrompt,
    activeTab,
    shouldEnableInspect
  };
}

// src/hooks/useInspector.ts
import { useState as useState6, useCallback as useCallback6, useEffect as useEffect7 } from "react";
function useInspector({
  initialIsActive = true,
  onPromptGenerated
} = {}) {
  const [isInspecting, setIsInspecting] = useState6(initialIsActive);
  const [userPrompt, setUserPrompt] = useState6("");
  const toggleInspection = useCallback6(() => {
    setIsInspecting((prev) => !prev);
  }, []);
  useEffect7(() => {
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
  const generatePrompt = useCallback6((elements2, prompt) => {
    if (elements2.length === 0 || !prompt.trim()) return;
    const generatedPrompt = createElementsPrompt(elements2, prompt);
    const promptEvent = new CustomEvent("promptGenerated", {
      detail: { prompt: generatedPrompt, elements: elements2 }
    });
    document.dispatchEvent(promptEvent);
    onPromptGenerated == null ? void 0 : onPromptGenerated(generatedPrompt, elements2);
    setUserPrompt("");
  }, [onPromptGenerated]);
  const handlePromptSubmit = useCallback6((e, elements2) => {
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
import { jsx as jsx17, jsxs as jsxs6 } from "react/jsx-runtime";
function ElementInspector({
  initialIsActive = true,
  excludeSelector = ".element-inspector-bubble, .element-inspector-controls, .element-inspector-mention",
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
    shouldEnableInspect
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
  const handleMenuToggle = useCallback7(() => {
    toggleInspection();
    if (isInspecting) {
      clearSelections();
    }
  }, [isInspecting, toggleInspection, clearSelections]);
  const onSubmitPrompt = useCallback7((e) => {
    handlePromptSubmit(e, selectedElements);
  }, [handlePromptSubmit, selectedElements]);
  useEffect8(() => {
    if (isInIframe && isInspecting !== shouldEnableInspect) {
      toggleInspection();
    }
  }, [isInIframe, isInspecting, shouldEnableInspect, toggleInspection]);
  useEffect8(() => {
    if (isInIframe) {
      window.parent.postMessage({ type: "UI_BUILDER_READY" }, "*");
    }
  }, [isInIframe]);
  return /* @__PURE__ */ jsxs6("div", { children: [
    /* @__PURE__ */ jsx17(
      InspectionOverlay,
      {
        isInspecting,
        hoveredElement,
        selectedElements,
        onElementHovered: handleElementHovered,
        onElementSelected: handleElementSelected,
        onElementUnhovered: handleElementUnhovered,
        excludeSelector,
        selectorStyle,
        highlighterStyle,
        elementLabel
      }
    ),
    /* @__PURE__ */ jsx17(
      BubbleMenu,
      {
        isInspecting,
        selectedElements,
        bubblePosition,
        isMenuAboveElement,
        userPrompt,
        setUserPrompt,
        onSubmitPrompt,
        onToggleInspection: handleMenuToggle,
        isDarkMode,
        showBubbleMenuButton
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