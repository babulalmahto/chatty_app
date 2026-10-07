import Message from "../models/Message.js";

class MessageController {
  static async getMessages(req, res) {
    try {
      const { conversationId } = req.params;
      const { cursor } = req.query;
      const limit = 20; // Number of messages to fetch per request

      const query = { conversation: conversationId };

      if (cursor) {
        // query._id = { $lt: cursor }; // Fetch messages older than the cursor
        query.createdAt = { $lt: new Date(cursor) }; // Fetch messages older than the cursor based on createdAt
      }
      let messages = await Message.find(query)
        .sort({ createdAt: -1 }) // Sort by newest first
        .limit(limit)
        .populate("sender", "username")
        .lean();

      const nextCursor =
        messages.length > 0
          ? messages[messages.length - 1].createdAt.toISOString()
          : null;

      //   messages = messages.reverse(); // Reverse to send oldest first
      res.status(200).json({
        messages: messages.reverse(),
        nextCursor,
        hasNext: messages.length === limit,
      });
    } catch (error) {
      console.log("Error fetching messages", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  }
}
export default MessageController;
