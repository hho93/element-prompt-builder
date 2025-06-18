// Styles for the ElementInspector component

// Layout styles
export const layout = {
  bubble: {
    position: 'fixed' as const,
    bottom: '24px',
    right: '24px',
    zIndex: 9999,
  },
  expandedMenu: {
    position: 'absolute' as const,
    bottom: '64px',
    right: '0',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    padding: '16px',
    width: '350px',
    transition: 'all 0.2s ease',
  },
  menuHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  inspectorToggle: {
    marginBottom: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  toggleLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  toggleRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  promptForm: {
    marginTop: '12px',
  },
  inputContainer: {
    display: 'flex',
  },
};

// Button styles
export const buttons = {
  mainButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '12px',
    borderRadius: '50%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  mainButtonHover: {
    backgroundColor: '#2563eb',
  },
  closeButton: {
    color: '#6b7280',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
  },
  closeButtonHover: {
    color: '#374151',
  },
  toggleButton: {
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: '500',
    border: 'none',
    cursor: 'pointer',
    transition: 'colors 0.2s ease',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    color: 'white',
    padding: '8px 12px',
    borderTopRightRadius: '6px',
    borderBottomRightRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
  },
  submitButtonHover: {
    backgroundColor: '#2563eb',
  },
};

// Text styles
export const text = {
  menuTitle: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#1f2937',
  },
  toggleText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
  },
  selectedCount: {
    fontSize: '12px',
    fontWeight: '500',
    color: '#10b981',
  },
  promptLabel: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '500',
    color: '#374151',
    marginBottom: '4px',
  },
};

// Input styles
export const inputs = {
  promptInput: {
    flexGrow: 1,
    padding: '8px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderTopLeftRadius: '6px',
    borderBottomLeftRadius: '6px',
    outline: 'none',
    borderColor: '#d1d5db',
  },
  promptInputFocus: {
    borderColor: '#3b82f6',
    boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.5)',
  },
  promptInputSelected: {
    borderColor: '#10b981',
  },
};

// Element styles
export const elements = {
  elementTagLabel: {
    position: 'absolute' as const,
    top: '0.5px',
    left: '0.5px',
    backgroundColor: 'rgba(52, 53, 65, 0.8)',
    borderRadius: '4px',
    padding: '2px 6px',
    fontSize: '12px',
    color: 'white',
    pointerEvents: 'none' as const,
  },
};

// State styles
export const states = {
  toggleButtonActive: {
    backgroundColor: '#dcfce7',
    color: '#065f46',
  },
  toggleButtonInactive: {
    backgroundColor: '#f3f4f6',
    color: '#1f2937',
  },
};

// Dark mode styles
export const darkMode = {
  expandedMenu: {
    backgroundColor: '#1f2937',
  },
  menuTitle: {
    color: '#e5e7eb',
  },
  closeButtonHover: {
    color: '#e5e7eb',
  },
  toggleText: {
    color: '#e5e7eb',
  },
  selectedCount: {
    color: '#34d399',
  },
  toggleButtonActive: {
    backgroundColor: '#064e3b',
    color: '#ecfdf5',
  },
  toggleButtonInactive: {
    backgroundColor: '#374151',
    color: '#d1d5db',
  },
  promptLabel: {
    color: '#d1d5db',
  },
  promptInput: {
    backgroundColor: '#374151',
    color: 'white',
    borderColor: '#4b5563',
  },
};
