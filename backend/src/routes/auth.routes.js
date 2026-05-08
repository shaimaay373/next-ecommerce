import { Router } from "express";
import { registration, login,googleAuth } from "../controllers/authController.js";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
const router = Router();
router.post('/google', googleAuth);
router.post("/register", registerValidator, registration);
router.post("/login", loginValidator, login);

export default router;


