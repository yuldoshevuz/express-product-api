import { Router } from "express";
import productController from "../controllers/product.controller.js";

const productRouter = Router()

productRouter.get("/", productController.getAllProducts)
productRouter.post("/", productController.addProduct)
productRouter.put("/:id", productController.updateProductData)
productRouter.delete("/:id", productController.deleteProduct)

export default productRouter