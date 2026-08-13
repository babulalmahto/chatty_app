export const initalizeSocket = async (io) => {
  io.on("connection", async (socket) => {
    console.log("User connected=====>", socket.id);
  });
};
