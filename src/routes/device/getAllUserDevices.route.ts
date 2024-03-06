import express from "express"
import { getAllUserDevicesController } from "../../controllers/device/getAllUserDevices.controller"
import { authentication } from "../../middlewares/authentication.middleware"

const getAllUserDevicesRoute = express.Router()
getAllUserDevicesRoute.get(
  "/get-all-user-devices",
  authentication,
  getAllUserDevicesController
)

export default getAllUserDevicesRoute
