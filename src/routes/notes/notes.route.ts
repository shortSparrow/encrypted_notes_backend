import express from "express"
import { sendNotesController } from "../../controllers/notes/sendNotes.controller"

const notesRoute = express.Router()
notesRoute.post("/send-notes", sendNotesController)
// notesRoute.put("edit-messages", )

export default notesRoute
