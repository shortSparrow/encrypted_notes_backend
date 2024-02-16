


import express from "express"
import { addNewDeviceController } from "../../controllers/device/addNewDevice.controller"

const addNewDeviceRoute = express.Router()
addNewDeviceRoute.post("/add-new-device", addNewDeviceController)

export default addNewDeviceRoute


