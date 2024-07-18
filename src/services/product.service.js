class ProductService {
    validateRequestParams(req) {
        const { name, description, price } = req.body;

        if (!name || !description || !price) {
            return false;
        }

        if (Number.isNaN(+price)) {
            return false;
        }

        return true;
    }
}

export default new ProductService();