import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import http from "http";

import { connectDB } from "./utils/db.js";

import authRoutes from "./routes/authRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import { initalizeSocket } from "./socket.js";
import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socket/socketAuthMiddleware.js";

import RedisService from "./services/RedisService.js";

const app = express();
const httpServer = http.createServer(app);

app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
  }),
);
app.use(cookieParser());

app.use(express.json());

// routes
app.use("/api/auth", authRoutes);
app.use("/api/conversations", conversationRoutes);

const io = new Server(httpServer, {
  cors: {
    origin: process.env.CLIENT_ORIGIN,
    credentials: true,
    methods: ["GET", "POST"],
  },
  pingInterval: 25000,
  pingTimeout: 60000,
});
io.use(socketAuthMiddleware);

await initalizeSocket(io);

await RedisService.initialize();

try {
  await connectDB();

  const PORT = process.env.PORT || 4000;
  httpServer.listen(PORT, () => {
    console.log(`Server running on port: ${PORT}`);
  });
} catch (error) {
  console.error("The server failed to start", error);
  process.exit(1);
}
