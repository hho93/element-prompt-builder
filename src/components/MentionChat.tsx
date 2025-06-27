import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useWorkflowsStore } from "../stores/workflows";
import { cn } from "../utils";
import Mapper from "./Mapper";
import {
  Mention,
  MentionContent,
  MentionInput,
  MentionItem,
} from "./ui/mention";

interface MentionChatProps {
  // mentionInputRef?: React.RefObject<HTMLInputElement> | undefined;
  input?: string;
  showWorkbench?: boolean;
  handleInputChange?: (value: string) => void;
  onSubmit?: (event: React.UIEvent | React.FormEvent) => void;
  style?: CSSProperties;
  textAreaClassName?: string;
  mentionContentClassName?: string;
  onFileChange?: (files: FileList | undefined) => void;
}

export const MentionChat: React.FC<MentionChatProps> = ({
  showWorkbench = false,
  handleInputChange,
  style,
  textAreaClassName = '',
  mentionContentClassName = '',
}) => {
  const isInIframe = typeof window !== 'undefined' && window.self !== window.top;
  const mentionInputRef = useRef<HTMLInputElement>(null);
  const [values, setValues] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState('');
  const workflows = useWorkflowsStore.getState().workflows || [];

  // Function to convert mention format to workflow XML format
  /* const convertMentionToWorkflowTag = useCallback((text: string): string => {
    let convertedText = text;
    values.forEach((value) => {
      const workflowName = workflows.find(workflow => workflow.id === value)?.name;
      if (workflowName) {
        const mentionRegex = new RegExp(`@${workflowName}`, 'g');
        convertedText = convertedText.replace(mentionRegex, `<workflow>${value}</workflow>`);
      }
    });
    return convertedText;
  }, [values]); */


  useEffect(() => {
    // const convertedText = convertMentionToWorkflowTag(inputValue);
    handleInputChange?.(inputValue);
    if (values.length > 0) {
      useWorkflowsStore.getState().setWorkflowId(values[0]);
    }
  }, [inputValue, values])

  useEffect(() => {
    if (isInIframe) {
      window.parent.postMessage(
        {
          type: "ELEMENT_INSPECTOR_MENTIONED",
          payload: { workflowId: values?.[0] },
        },
        "*"
      );
    }
  }, [isInIframe, values]);
  

  useEffect(() => {
    if (!mentionInputRef.current) return;
    mentionInputRef.current.parentElement
      ?.querySelector("div")
      ?.classList?.add("!whitespace-nowrap");
  }, [mentionInputRef.current]);

  useEffect(() => {
    if (inputValue) return
    setValues([])
  }, [inputValue])

  return (
    <Mention
      trigger="@"
      className={cn(
        'w-full focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent',
        {
          'max-w-[435px] ml-0': showWorkbench,
        },
        'element-inspector-mention'
      )}
      inputValue={inputValue}
      value={values}
      onInputValueChange={setInputValue}
      onValueChange={setValues}
    >
      <MentionInput
        value={inputValue}
        ref={mentionInputRef}
        placeholder={"Tell me how to modify this element..."}
        className={cn(
          '!shadow-none !ring-0 !border-none w-full focus:outline-none text-sm text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent px-1',
          {
            'max-w-[435px] ml-0': showWorkbench,
          },
          textAreaClassName
        )}
        style={{ ...style, resize: 'none' }}
      />
      {values.length === 0 && (
        <MentionContent className={cn("max-h-[200px] h-[200px] min-w-[250px] overflow-y-auto relative border-none outline-none", mentionContentClassName)} style={{ zIndex: 10001 }}>
          <Mapper data={workflows} extractedKey={'id'}>
            {(item) => (
              <MentionItem
                key={item.id}
                value={item.id}
                label={item.name}
                className="flex-col items-start gap-0.5"
                disabled={values.length > 0 && !values.includes(item.id)}
              >
                <p className="text-sm">{item.name}</p>
                <p className="text-xs text-gray-500">{item.id}</p>
              </MentionItem>
            )}
          </Mapper>
        </MentionContent>
      )}
    </Mention>
  );
};
