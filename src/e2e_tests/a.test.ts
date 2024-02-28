import request from "supertest"

import { dbClient, initDb } from "../database/database"
import app from "../app"
import { query } from "../utils/db/query";

function delay(time: number) {
  return new Promise(resolve => setTimeout(resolve, time));
}

// ! if uncomment works fine
// beforeAll(async () => {
// await initDb()
// })

describe("LoginUser Route",  () => {
  it("XXX", async () => {
    console.log("dbClient: ", dbClient.database)
    const result = await dbClient.query("SELECT * FROM users WHERE phone = $1", [
      '+39',
    ])

    
    // await request(app)
    //   .post("/register")
    //   .send({ phone: "+380663927900", password: "pass", deviceId: "1" })
    //   .set("Accept", "application/json")
    //   .expect("Content-Type", /json/)
    //   .expect(200)
  })
})

// afterAll(async () => {
//   console.log("dbClient: ", dbClient.database)
//   await dbClient.query("DROP TABLE devices, users, device_refresh_tokens;", [])
//   await dbClient.end()
// })
