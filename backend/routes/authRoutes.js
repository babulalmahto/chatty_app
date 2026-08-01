import AuthController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";
import express from "express";

const router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
// router.post("/logout", authMiddleware, AuthController.logout);
router.get("/me", authMiddleware, AuthController.me);

export default router;
