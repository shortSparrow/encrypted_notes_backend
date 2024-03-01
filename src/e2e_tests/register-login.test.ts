import request from "supertest"

import { dbClient, initDb } from "../database/database"
import app from "../app"

beforeAll(async () => {
  await initDb()
})

describe("Login and Register user", () => {
  it("should return 401 if login with invalid credentials or user not exist", async () => {
    await request(app)
      .post("/login")
      .send({ phone: "+380663927900", password: "pass", deviceId: "1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(401)

    await request(app)
      .post("/login")
      .send({ phone: "+380", password: "pass", deviceId: "1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(400)
  })

  it("should create new user and login", async () => {
    await request(app)
      .post("/register")
      .send({ phone: "+380663927900", password: "pass", deviceId: "1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.accessToken.length).not.toBe(0)
        expect(data.body.refreshToken.length).not.toBe(0)
      })

    await request(app)
      .post("/login")
      .send({ phone: "+380663927900", password: "pass", deviceId: "1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.accessToken.length).not.toBe(0)
        expect(data.body.refreshToken.length).not.toBe(0)
      })
  })

  it("should login and create new deice", async () => {
    await request(app)
      .post("/login")
      .send({ phone: "+380663927900", password: "pass", deviceId: "2" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.accessToken.length).not.toBe(0)
        expect(data.body.refreshToken.length).not.toBe(0)
      })
  })
})

afterAll(async () => {
  await dbClient.query("DROP TABLE devices, users, device_refresh_tokens;", [])
  await dbClient.end()
})
