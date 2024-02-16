import express from "express"
import { registerController } from "../../controllers/user/registerUser.controller"

const registerRoute = express.Router()
registerRoute.post("/register", registerController)

export default registerRoute
