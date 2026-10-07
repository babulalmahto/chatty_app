import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useConversationStore } from "../../stores/conversationStore";
import MessageItem from "./MessageItem";
import { useAuthStore } from "../../stores/authStore";
import { useSocketContext } from "../../context/SocketContext";
import { useMessageListen } from "../../hooks/useMessageListen";
import { useTypingListen } from "../../hooks/useTypingListen";
import TypingIndicator from "./TyoingIndicator";

const MessageList: React.FC = () => {
  const { selectedConversation } = useConversationStore();
  const { user } = useAuthStore();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const { data, isLoading, handleLoadMore, isFetchingNextPage, hasNextPage } =
    useMessages(selectedConversation?.conversationId, containerRef);

  const { socket } = useSocketContext();
  const previusConversationIdRef = useRef<string | null>(null);

  const allMessages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.messages) ?? [];
  console.log(allMessages, "data=========>", data);

  useEffect(() => {
    if (!selectedConversation?.conversationId) return;

    // if (data?.pages.length == 1) {
    if (
      data?.pages.length &&
      previusConversationIdRef.current !== selectedConversation.conversationId
    ) {
      setTimeout(() => {
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      }, 0);

      previusConversationIdRef.current = selectedConversation.conversationId;
    }

    socket?.emit("conversation:mark-as-read", {
      conversationId: selectedConversation?.conversationId,
      userId: user?.id,
      friendId: selectedConversation?.friend.id,
    });
  }, [data, selectedConversation, socket, user]);

  useMessageListen(
    selectedConversation?.conversationId,
    selectedConversation?.friend.id,
    containerRef,
  );

  const { isTyping } = useTypingListen(
    selectedConversation?.friend.id,
    containerRef,
  );

  if (isLoading) {
    return (
      <div className="relative flex-1 h-full flex items-center justify-center">
        <div className="size-10 bg-sky-100 rounded-full animate-pulse"></div>
      </div>
    );
  }
  console.log("allMessages=====>", allMessages);
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

      {isTyping && <TypingIndicator />}
    </div>
  );
};

export default MessageList;
