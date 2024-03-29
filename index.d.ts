import express from "express"

export type AuthToken = { userId: number; deviceId: string }

// TODO figure out how to better, this approach or just make as MyRequestType in cases where is needed
declare module "express-serve-static-core" {
  interface Request {
    verifiedToken?: AuthToken
  }
}

export type UserDeviceId = {
  userId: number
  deviceId: string
}
