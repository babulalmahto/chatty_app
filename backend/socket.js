export const initalizeSocket = async (io) => {
  io.on("connection", async (socket) => {
    // console.log("User connected=====>", socket.id);
    try {
      const user = socket.user;
      console.log("User connected", user.id);
      socket.join(user._id.toString());
    } catch (error) {
      console.error("Socket connection error:", error);
      socket.emit("internal_error", { error: "Internal server error" });
    }
  });
};
