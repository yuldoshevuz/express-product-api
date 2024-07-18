import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authRouter from "./auth.routes.js";
import productRouter from "./product.routes.js";
import errorController from "../controllers/error.controller.js"

import swaggerUi from "swagger-ui-express"
import swaggerDocs from "../data/swagger.json" assert { type: "json" }

const router = Router()

// Auth routes
router.use("/auth", authRouter)

router.use("/docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocs)
)

router.use("/products",
    authMiddleware.authenticate,
    productRouter
)

// Error handler middlewares
router.use(errorController.serverError)
router.use(errorController.pageNotFound)

export default router