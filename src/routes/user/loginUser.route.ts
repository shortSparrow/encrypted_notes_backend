import express from "express"
import { loginController } from "../../controllers/user/loginUser.controller"

const loginRoute = express.Router()
loginRoute.post("/login", loginController)

export default loginRoute
