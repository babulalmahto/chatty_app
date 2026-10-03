import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useConversationStore } from "../../stores/conversationStore";
import MessageItem from "./MessageItem";

const MessageList: React.FC = () => {
  const { selectedConversation } = useConversationStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, handleLoadMore, isFetchingNextPage, hasNextPage } =
    useMessages(selectedConversation?.conversationId, containerRef);

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
      {hasNextPage && (
        <div className="flex justify-center mb-4">
          <button
            type="button"
            className="px-4 py-1 text-xs bg-gray-300 text-white rounded-lg hover:bg-gray-400 transition-colors cursor-pointer"
            onClick={handleLoadMore}
            disabled={isFetchingNextPage}
          >
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </button>
        </div>
      )}

      {allMessages.map((message) => (
        <div key={message._id}>
          <MessageItem {...message} />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
