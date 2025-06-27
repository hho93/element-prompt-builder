import { create } from "zustand";

/**
 * Interface for the workflows store state and actions
 */
export interface WorkflowsState {
  // State properties
  workflows: any[];

  workflowId: string;

  // Actions
  setWorkflowId: (data: string) => void;
  setWorkflows: (data: any[]) => void;
}

/**
 * Zustand store for workflows
 */
export const useWorkflowsStore = create<WorkflowsState>()((set, get) => ({
  // Initial state
  workflows: [],
  workflowId: "",

  // Actions to update workflows state
  setWorkflowId: (workflowId: string) =>
    set({ workflowId }),
  setWorkflows: (data) =>
    set({
      workflows: data,
    }),
  getworkflows: () => {
    return get().workflows;
  },
}));
