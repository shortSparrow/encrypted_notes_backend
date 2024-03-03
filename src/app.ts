import express, { Express } from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import api from "./routes/api"

dotenv.config()

const app: Express = express()

app.use(express.json())
app.use(cookieParser())


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
// disable cors

app.use(api)

export default app
