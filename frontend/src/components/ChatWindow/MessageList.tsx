import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useConversationStore } from "../../stores/conversationStore";
import MessageItem from "./MessageItem";

const MessageList: React.FC = () => {
  const { selectedConversation } = useConversationStore();
  const { data, isLoading } = useMessages(selectedConversation?.conversationId);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const allMessages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.messages) ?? [];
  // console.log(allMessages, "data=========>", data);

  useEffect(() => {
    if (!selectedConversation?.conversationId) return;

    if (data?.pages.length == 1) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [data, selectedConversation]);

  if (isLoading) {
    return (
      <div className="relative flex-1 h-full flex items-center justify-center">
        <div className="size-10 bg-sky-100 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10"
    >
      {allMessages.map((message) => (
        <div key={message._id}>
          <MessageItem {...message} />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
