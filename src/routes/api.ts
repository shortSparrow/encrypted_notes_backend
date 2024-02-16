import express from "express"
import registerRoute from "./user/registerUser.route"
import addNewDeviceRoute from "./device/addNewDevice.route"
import loginRoute from "./user/loginUser.route"

const api = express.Router()

api.use(registerRoute)
api.use(loginRoute)
api.use(addNewDeviceRoute)

export default api
