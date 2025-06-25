import { create } from 'zustand';
import map from 'lodash/map'
interface InputVariable {
  key: string;
  value: string;
  type: string;
  label?: string;
  placeholder?: string;
  options?: string[];
}

interface MappingField {
  payloadField: string;
  referenceField: string;
  value: string;
  hasError?: boolean; // Optional field to indicate if there's an error
}

export interface MessagesState {
  startNodeInputVariables: Record<string, InputVariable>;
  mappingFields: MappingField[];
  setStartNodeInputVariables: (variables: Record<string, InputVariable>) => void;
  getMappingFields: () => MappingField[];
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  startNodeInputVariables: {},
  // Default mapping fields to show in UI based on the screenshot
  mappingFields: [],
  setStartNodeInputVariables: (variables) => {
      set({ mappingFields: map(variables, item => ({
          payloadField: item.key,
          referenceField: "",
          value:  "" ,
          hasError: false
        })) });

  },
  getMappingFields: () => {
    return get().mappingFields;
  },
}));