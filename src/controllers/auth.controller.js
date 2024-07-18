import User from "../models/user.model.js";
import authService from "../services/auth.service.js";

class AuthController {
    /**
     * @route    POST /auth/register
     * @desc     Register new user to database
     * @access   Public
    */
    async registerNewUser(req, res, next) {
        try {
            // Check all parametrs available or not
            if (!authService.validateRequestParams(req, "register")) {
                return res.status(400).json({
                    ok: false,
                    message: "Please send all parameters"
                })
            }

            const { fullName, email, password } = req.body

            // Check if the user exists
            const existingUser = await authService.checkExistingUser(email)
            if (existingUser) {
                return res.status(400).json({
                    ok: false,
                    message: "A user with this email address already exists"
                });
            }

            // Hash password
            const hashedPassword = await authService.hashPassword(password)

            // Create new user
            const newUser = await User.create({ fullName, email, password: hashedPassword });
            const userData = authService.userWithoutPassword(newUser)

            return res.status(201).json({
                ok: true,
                data: userData
            });
        } catch (error) {
            next(error)
        }
    };
    
    /**
     * @route    POST /auth/login
     * @desc     Login user to website
     * @access   Public
    */
    async loginExistingUser(req, res, next) {
        try {
            const { email, password } = req.body;

            // Check all parametavailable or not
            if (!authService.validateRequestParams(req, "login")) {
                return res.status(400).json({
                    ok: false,
                    message: "Please send all parameters"
                })
            }

            // Check if the user exists
            const existingUser = await authService.checkExistingUser(email)
            if (!existingUser) {
                return res.status(400).json({
                    ok: false,
                    message: "Invalid email or password"
                });
            }

            // Compare passwords
            const isMatch = await authService.comparePassword(password, existingUser.password)
            if (!isMatch) {
                return res.status(400).json({
                    ok: false,
                    message: "Invalid email or password"
                });
            }

            // Generate new JWT token
            const newToken = authService.generateToken({
                userId: existingUser.id
            });

            // Return user data (excluding password)
            const userData = authService.userWithoutPassword(existingUser)

            return res.status(200).json({
                ok: true,
                data: {
                    ...userData,
                    token: newToken
                }
            });
        } catch (error) {
            next(error)
        }
    };
}

export default new AuthController();