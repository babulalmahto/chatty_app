import AuthController from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddlewares.js";

const router = express.Router();

router.post("/register", AuthController);
router.post("/login", AuthController.login);
router.post("/logout", authMiddleware, AuthController.logout);
router.post("/me", authMiddleware, AuthController.me);

export default router;
