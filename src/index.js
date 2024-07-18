import express from "express"
import environments from "./config/environments.js"
import connectDB from "./config/connect.db.js"
import router from "./routes/index.js"
import bodyParser from "body-parser"

export const app = express()

const bootstrap = () => {
    // Middlewares
    app.use(bodyParser.json())

    // Main router initialization
    app.use(router)

    // Connecting to db
    connectDB()

    // App listening on port environment variables' PORT
    app.listen(environments.PORT, () => {
        console.log("Server running on port:", environments.PORT)
    })
}

bootstrap()