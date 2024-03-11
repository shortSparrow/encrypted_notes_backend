require("reflect-metadata")
// import * as crypto from "crypto"
const crypto = require("crypto")
// import { mockRandomUUID } from "./src/__mock__/uuid"
const { mockRandomUUID } = require("./src/__mock__/uuid")

jest.spyOn(crypto, "randomUUID").mockReturnValue(mockRandomUUID)
