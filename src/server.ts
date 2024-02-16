import http from "http"
import "reflect-metadata"
import app from "./app"
import { initDb } from "./database/database"

const PORT = Number(process.env.PORT) || 3000

const server = http.createServer(app)

server.listen(PORT, "localhost", async () => {
  await initDb()
  console.log("Server start listening on port: ", PORT)
})
