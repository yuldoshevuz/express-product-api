import Product from "../models/product.model.js";
import productService from "../services/product.service.js";

class ProductController {
    /**
    * @route    GET /products
    * @desc     Fetch all products
    * @access   Private
    */
    async getAllProducts(req, res, next) {
        try {
            const products = await Product.findAll();

            if (!products.length) {
                return res.status(200).json({
                    ok: true,
                    data: [],
                    message: "There are no products available at the moment"
                });
            }

            res.status(200).json({
                ok: true,
                data: products
            });
        } catch (error) {
            next(error);
        }
    };

    /**
    * @desc     Create a new product
    * @access   Private
    * @route    POST /products
    */
    async addProduct(req, res, next) {
        try {
            if (!productService.validateRequestParams(req)) {
                return res.status(400).json({
                    ok: false,
                    message: "Please send all parameters (name, description, price)"
                });
            }

            const { name, description, price } = req.body;

            const newProduct = await Product.create({ name, description, price });

            res.status(201).json({
                ok: true,
                data: newProduct
            });
        } catch (error) {
            next(error);
        }
    };

    /**
     * @route    PUT /products/:id
     * @desc     Update an existing product
     * @access   Private
     */
    async updateProductData(req, res, next) {
        try {
            const existingProduct = await Product.findByPk(req.params.id).catch(() => null);

            if (!existingProduct) {
                return res.status(404).json({
                    ok: false,
                    message: "There is no product with this id"
                });
            }

            const { name, description, price } = req.body;

            if (name) {
                existingProduct.name = name;
            }
            if (description) {
                existingProduct.description = description;
            }
            if (price && !Number.isNaN(+price)) {
                existingProduct.price = +price;
            }

            await existingProduct.save();

            res.status(200).json({
                ok: true,
                data: existingProduct
            });
        } catch (error) {
            next(error);
        }
    };

    /**
    * @route    DELETE /products/:id
    * @desc     Delete a product.
    * @access   Private
    */
    async deleteProduct(req, res, next) {
        try {
            const existingProduct = await Product.findByPk(req.params.id).catch(() => null);

            if (!existingProduct) {
                return res.status(404).json({
                    ok: false,
                    message: "There is no product with this id"
                });
            }

            await existingProduct.destroy();

            res.status(200).json({
                ok: true,
                message: "Deleted successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new ProductController();