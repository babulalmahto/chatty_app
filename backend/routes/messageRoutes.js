import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js";
import MessageController from "../controllers/messageController.js";

const router = express.Router();

// GET /api/messages/:conversationId
router.get(
  "/:conversationId/messages",
  authMiddleware,
  MessageController.getMessages,
);

export default router;
