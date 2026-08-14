import RedisService from "./services/redisService.js";
import { leaveAllRooms } from "./socket/helpers.js";
import { notifyConversationOnlineStatus } from "./socket/socketConversation.js";

export const initalizeSocket = async (io) => {
  io.on("connection", async (socket) => {
    // console.log("User connected=====>", socket.id);
    try {
      const user = socket.user;
      console.log("User connected", user.id);
      socket.join(user._id.toString());

      await RedisService.addUserSession(user.id, socket.id);
      await notifyConversationOnlineStatus(io, socket, true);

      socket.on("disconnect", async () => {
        await RedisService.removeUserSession(user.id, socket.id);

        const isOnline = await RedisService.isUserOnline(user.id);
        if (!isOnline) {
          console.log(`User ${user.id} is now offline`);
          await notifyConversationOnlineStatus(io, socket, false);

          leaveAllRooms(socket);
        }
        console.log("User disconnected", user.id);
      });
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.emit("internal_error", { error: "Internal server error" });
    }
  });
};
