import express from "express"
import { sendNotesController } from "../../controllers/notes/sendNotes.controller"
import { authentication } from "../../middlewares/authentication.middleware"

const notesRoute = express.Router()
notesRoute.post("/send-notes", authentication, sendNotesController)
// notesRoute.put("edit-messages", )

export default notesRoute
