import express from "express"
import registerRoute from "./user/registerUser.route"
import addNewDeviceRoute from "./device/addNewDevice.route"
import loginRoute from "./user/loginUser.route"
import getNewAccessTokenRoute from "./token/get-new-access-token"

const api = express.Router()

api.use(registerRoute)
api.use(loginRoute)
api.use(addNewDeviceRoute)
api.use(getNewAccessTokenRoute)

export default api
