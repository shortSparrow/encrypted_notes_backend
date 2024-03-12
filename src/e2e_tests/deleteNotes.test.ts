import request from "supertest"

import { dbClient, initDb } from "../database/database"
import app from "../app"
import { mockNoteEncryptionPublicKey } from "../__mock__/mockEncryption"
import { TableNames } from "../database/constants"
import { NoteRequest } from "../entities/note"

beforeAll(async () => {
  await initDb()
})

const userData = {
  phone: "+380663927900",
  password: "111111qW",
  deviceId: "device_id_1",
  noteEncryptionPublicKey: mockNoteEncryptionPublicKey,
}

const note: NoteRequest = {
  data: {
    title: {
      cipherText: [1, 2, 3],
      nonce: [4, 5, 6],
      mac: [7, 8, 9],
    },
    message: {
      cipherText: [10, 11, 12],
      nonce: [14, 15, 16],
      mac: [17, 18, 19],
    },
  },
  metaData: {
    createdAt: "1709485666330",
    updatedAt: "1709485666330",
    sendToDeviceId: "",
  },
}

const mockTokenUser1 = jest.fn()
const mockTokenUser2 = jest.fn()
const mockTokenUser3 = jest.fn()

const mockGlobalNoteId = jest.fn()

describe("Send notes to another devices", () => {
  it("register 3 devices", async () => {
    await request(app)
      .post("/register")
      .send({ ...userData, deviceId: "device_id_1" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.accessToken.length).not.toBe(0)
        expect(data.body.refreshToken.length).not.toBe(0)
        expect(data.body.userId).toBe(1)
        mockTokenUser1.mockReturnValue(data.body.accessToken)
      })

    await request(app)
      .post("/login")
      .send({ ...userData, deviceId: "device_id_2" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.accessToken.length).not.toBe(0)
        expect(data.body.refreshToken.length).not.toBe(0)
        expect(data.body.userId).toBe(1)
        mockTokenUser2.mockReturnValue(data.body.accessToken)
      })

    await request(app)
      .post("/login")
      .send({ ...userData, deviceId: "device_id_3" })
      .set("Accept", "application/json")
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.accessToken.length).not.toBe(0)
        expect(data.body.refreshToken.length).not.toBe(0)
        expect(data.body.userId).toBe(1)
        mockTokenUser3.mockReturnValue(data.body.accessToken)
      })
  })

  it("send message from device_id_1 to device_id_2 and device_id_3", async () => {
    await request(app)
      .post("/send-notes")
      .send([
        {
          ...note,
          metaData: { ...note.metaData, sendToDeviceId: "device_id_1" },
        },
        {
          ...note,
          metaData: { ...note.metaData, sendToDeviceId: "device_id_2" },
        },
        {
          ...note,
          metaData: { ...note.metaData, sendToDeviceId: "device_id_3" },
        },
      ])
      .set("Accept", "application/json")
      .set("Authorization", `Bearer ${mockTokenUser1()}`)
      .expect(200)
      .then((data) => {
        mockGlobalNoteId.mockReturnValue(data.body[0].noteGlobalId)
      })
  })

  it("should return note for each recipient", async () => {
    await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${mockTokenUser1()}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body[0]).toEqual({
          ...note,
          metaData: {
            ...note.metaData,
            noteGlobalId: mockGlobalNoteId(),
            sendToDeviceId: "device_id_1",
            sendFromDeviceId: "device_id_1",
            syncedWithDevices: ["device_id_1", "device_id_2", "device_id_3"],
          },
        })
      })

    await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${mockTokenUser2()}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body[0]).toEqual({
          ...note,
          metaData: {
            ...note.metaData,
            noteGlobalId: mockGlobalNoteId(),
            sendToDeviceId: "device_id_2",
            sendFromDeviceId: "device_id_1",
            syncedWithDevices: ["device_id_1", "device_id_2", "device_id_3"],
          },
        })
      })

    await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${mockTokenUser3()}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body[0]).toEqual({
          ...note,
          metaData: {
            ...note.metaData,
            noteGlobalId: mockGlobalNoteId(),
            sendToDeviceId: "device_id_3",
            sendFromDeviceId: "device_id_1",
            syncedWithDevices: ["device_id_1", "device_id_2", "device_id_3"],
          },
        })
      })
  })

  it("should remove notes", async () => {
    await request(app)
      .delete("/delete-notes")
      .set("Authorization", `Bearer ${mockTokenUser2()}`)
      .query({ noteGlobalId: mockGlobalNoteId() })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.isSuccess).toBe(true)
      })
  })

  it("should return note for each recipient", async () => {
    await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${mockTokenUser1()}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.length).toBe(0)
      })

    await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${mockTokenUser2()}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.length).toBe(0)
      })

    await request(app)
      .get("/get-all-notes")
      .set("Authorization", `Bearer ${mockTokenUser3()}`)
      .expect("Content-Type", /json/)
      .expect(200)
      .then((data) => {
        expect(data.body.length).toBe(0)
      })
  })
})

afterAll(async () => {
  await dbClient.query(
    `DROP TABLE ${TableNames.DEVICES}, ${TableNames.USERS}, ${TableNames.DEVICE_REFRESH_TOKENS}, ${TableNames.NOTES};`,
    []
  )
  await dbClient.end()
})
