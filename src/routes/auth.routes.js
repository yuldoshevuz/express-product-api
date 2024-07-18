import { Router } from "express";
import authController from "../controllers/auth.controller.js";

const authRouter = Router()

// Auth routes
authRouter.post("/login", authController.loginExistingUser)
authRouter.post("/register", authController.registerNewUser)

export default authRouter