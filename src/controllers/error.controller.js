import logger from "../helpers/logger.js";

class ErrorController {
    async serverError(err, req, res, next) {
        try {
            await logger(err);
        } catch (loggingError) {
            console.error("Logging error failed:", loggingError);
        } finally {
            res.status(500).json({
                ok: false,
                message: "Internal server error"
            });
        }
    }

    pageNotFound(req, res) {
        res.status(404).json({
            ok: false,
            message: "Page not found"
        });
    }
}

export default new ErrorController();