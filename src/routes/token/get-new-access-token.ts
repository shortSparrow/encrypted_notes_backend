import express from "express"
import { getNewAccessTokenController } from "../../controllers/token/getNewAccessTokenController"

const getNewAccessTokenRoute = express.Router()
getNewAccessTokenRoute.post("/get-new-access-token", getNewAccessTokenController)

export default getNewAccessTokenRoute
