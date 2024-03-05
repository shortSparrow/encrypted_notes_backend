


import express from "express"
import { getAllUserDevicesController } from "../../controllers/device/getAllUserDevices.controller"

const getAllUserDevicesRoute = express.Router()
getAllUserDevicesRoute.get("/get-all-user-devices", getAllUserDevicesController)

export default getAllUserDevicesRoute


