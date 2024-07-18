import environments from "../config/environments.js"
import bcrypt from "bcrypt"
import User from "../models/user.model.js";
import jwt from "jsonwebtoken"

class AuthService {
    // Middleware to validate request body parameters
    validateRequestParams(req, where = "register") {
        const { fullName, email, password } = req.body;

        if (where === "login" & !(email || password)) {
            return false
        } else if (where === "register" && !(fullName || email || password)) {
            return false
        }

        return true
    }

    // Middleware to check existing user
    async checkExistingUser(email) {
        const existingUser = await User.findOne({ where: { email } });
        return existingUser ? existingUser : null
    }

    // Middleware to hash password
    async hashPassword(password) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
            
        return hashedPassword
    }

    async comparePassword(password, hashedPassword) {
        return await bcrypt.compare(password, hashedPassword)
    }

    // Generate new token method
    generateToken(payload) {
        return jwt.sign(payload, environments.JWT_SECRET, { expiresIn: "7d" })
    }

    // Verify token right or not
    verifyToken(token) {
        try {
            return jwt.verify(token, environments.JWT_SECRET)
        } catch (error) {
            return null
        }
    };

    async validateSignature(req) {
        const authorization = req.headers["authorization"]


        
        const signature = authorization?.split(" ")[1]
        if (!signature) {
            return false
        }
        
        try {
            const payload = this.verifyToken(signature)

            const existingUser = await User.findByPk(payload.userId)
            if (!existingUser) {
                return false
            }
    
            req.user = payload
            return true
        } catch (error) {
            return false
        }
    }

    userWithoutPassword(user) {
        const userData = user.toJSON();
        delete userData.password;

        return userData
    }
}

export default new AuthService()