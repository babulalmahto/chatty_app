import express from "express";
import authMiddleware from "../middlewares/authMiddlewares.js";
import ConversationController from "../controllers/conversationController.js";

const router = express.Router();

router.get(
  "/check-connect-code",
  authMiddleware,
  ConversationController.checkConnectCode,
);
router.get("/", authMiddleware, ConversationController.getConversations);

export default router;
