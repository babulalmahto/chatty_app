import { useMessages } from "../../hooks/useMessages";
import { useConversationStore } from "../../stores/conversationStore";
import MessageItem from "./MessageItem";

const MessageList: React.FC = () => {
  const { selectedConversation } = useConversationStore();

  const { data, isLoading } = useMessages(selectedConversation?.conversationId);

  const allMessages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((page) => page.messages) ?? [];
  // console.log(allMessages, "data=========>", data);

  if (isLoading) {
    return (
      <div className="relative flex-1 h-full flex items-center justify-center">
        <div className="size-10 bg-sky-100 rounded-full animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 overflow-y-auto p-4 pb-10">
      {allMessages.map((message) => (
        <div key={message._id}>
          <MessageItem {...message} />
        </div>
      ))}
    </div>
  );
};

export default MessageList;
