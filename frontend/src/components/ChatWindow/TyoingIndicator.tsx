const TypingIndicator: React.FC = () => {
  return (
    <div className="flex">
      <img
        src="https://api.dicebear.com/9.x/adventurer/svg?seed=ravi"
        alt="User"
        className="size-8 rounded-full object-cover mr-2"
      />
      <div className="bg-white p-3 rounded-2x1 flex items-center">
        <div
          className="size-2 bg-gray-400 rounded-full animate-pulse mr-1"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="size-2 bg-gray-400 rounded-full animate-pulse mr-1"
          style={{ animationDelay: "0s" }}
        ></div>
        <div
          className="size-2 bg-gray-400 rounded-full animate-pulse"
          style={{ animationDelay: "0s" }}
        ></div>
      </div>
    </div>
  );
};

export default TypingIndicator;
