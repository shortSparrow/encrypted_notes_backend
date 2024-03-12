import express from "express"
import { logoutController } from "../../controllers/user/logout.controller"
import { authentication } from "../../middlewares/authentication.middleware"

const logoutRoute = express.Router()
logoutRoute.post("/logout", authentication, logoutController)

export default logoutRoute
