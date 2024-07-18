import authService from "../services/auth.service.js"

class AuthMiddleware {
    async authenticate(req, res, next) {
        try {
            const signature = await authService.validateSignature(req)
            if (!signature) {
                res.status(401).json({
                    ok: false,
                    message: "You are not authorized"
                })
                return
            }
    
            next()
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthMiddleware()