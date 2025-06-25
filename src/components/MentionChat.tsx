import find from "lodash/find";
import get from "lodash/get";
import last from "lodash/last";
import React, {
  CSSProperties,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import workflowApi from "../services/workflows";
import { useMessagesStore } from "../stores/messages";
import { useAuthStore } from "../stores/auth";
import { cn } from "../utils";
import Mapper from "./Mapper";
import Spinner from "./Spinner";
import {
  Mention,
  MentionContent,
  MentionInput,
  MentionItem,
} from "./ui/mention";
import { Textarea } from "./ui/textarea";

interface MentionChatProps {
  textareaRef?: React.RefObject<HTMLTextAreaElement> | undefined;
  input?: string;
  showWorkbench?: boolean;
  handleInputChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
  setCurrentTab?: (tab: 'chat' | 'workflow' | 'design') => void;
  scrollToBottom?: () => void;
  onSubmit?: (event: React.UIEvent | React.FormEvent) => void;
  style?: CSSProperties;
  textAreaClassName?: string;
  mentionContentClassName?: string;
  onFileChange?: (files: FileList | undefined) => void;
}

export const MentionChat: React.FC<MentionChatProps> = ({
  textareaRef,
  input = '',
  showWorkbench = false,
  handleInputChange,
  setCurrentTab,
  scrollToBottom,
  style,
  textAreaClassName = '',
  mentionContentClassName = '',
}) => {
  console.log("input", input);
  
  const [isMentionOpen, setIsMentionOpen] = useState(false);
  const mentionRef = useRef<HTMLDivElement>(null);
  const [values, setValues] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [workflows, setWorkflows] = useState<any[]>([]);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true)
      const res = await workflowApi.getPaginatedWorkflows({
        page: 1,
        per_page: 100,
      }, useAuthStore.getState().accessToken!);

      setWorkflows(res.data);
    } catch (error) {
      console.log("Error fetching data:", error);
    } finally {
      setIsLoading(false)
    }
  }, []);

  const currentWorkflow = useMemo(() => {
    const name = last(values) || "";
    return find(workflows, { name }) || {};
  }, [values, workflows])


  const flowDataNodes = useMemo(() => {
    try {
      return get(JSON.parse(get(currentWorkflow, 'flowData', '{}')), 'nodes', []);
    } catch (error) {
      console.error("Error parsing flowData:", error);
      return []
    }
  }, [currentWorkflow]);

  const startNodeInputVariables = useMemo(() => {
    return get(find(flowDataNodes, { type: 'startNode' }) || {}, 'data.inputs.variables', {});
  }, [flowDataNodes]);

  useEffect(() => { fetchData() }, [fetchData])

  useEffect(() => {
    // Store startNodeInputVariables into the messages store
    useMessagesStore.getState().setStartNodeInputVariables(startNodeInputVariables);
  }, [startNodeInputVariables])

  return (
    <Mention
      trigger="@"
      className={cn(
        'w-full p-2 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent',
        {
          'max-w-[435px] ml-0': showWorkbench,
        },
      )}
      onOpenChange={setIsMentionOpen}
      inputValue={input}
      onInputValueChange={(value) => {
        handleInputChange?.({ target: { value } } as React.ChangeEvent<HTMLTextAreaElement>);
      }}
      value={values}
      onValueChange={setValues}
    >
      <MentionInput placeholder={"Tell me how to modify this element...\nI can help change its style, content, or\nbehavior."} asChild>
        <Textarea
          ref={textareaRef}
          className={cn(
            '!shadow-none !ring-0 !border-none w-full p-2 focus:outline-none resize-none text-md text-bolt-elements-textPrimary placeholder-bolt-elements-textTertiary bg-transparent',
            {
              'max-w-[435px] ml-0': showWorkbench,
            },
            textAreaClassName
          )}
          onChange={handleInputChange}
          value={input}
          style={style}
          translate="no"
        />
      </MentionInput>
      <MentionContent ref={mentionRef} className={cn("max-h-[200px] h-[200px] overflow-y-auto relative", mentionContentClassName)}>
        {isLoading && (
          <div className="absolute left-1/2 top-1/2 z-[9] h-full w-full -translate-x-1/2 -translate-y-1/2 bg-black/20">
            <div className="flex h-full w-full items-center justify-center">
              <Spinner className="!h-4 !w-4" />
            </div>
          </div>
        )}
        <Mapper data={workflows} extractedKey={'id'}>
          {(item) => (
            <MentionItem
              value={item.name}
              label={item.name}
              className="flex-col items-start gap-0.5"
            >
              <p className="text-sm">{item.name}</p>
              <p className="text-xs text-gray-500">{item.id}</p>
            </MentionItem>
          )}
        </Mapper>
      </MentionContent>
    </Mention>
  );
};
