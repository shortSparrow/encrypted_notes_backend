import express, { Express } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import api from "./routes/api"

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cookieParser())

app.use(api)

export default app
