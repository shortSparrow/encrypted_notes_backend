import express from "express"
import { sendNotesController } from "../../controllers/notes/sendNotes.controller"
import { authentication } from "../../middlewares/authentication.middleware"
import { editNotesController } from "../../controllers/notes/editNotes.controller"

const notesRoute = express.Router()
notesRoute.post("/send-notes", authentication, sendNotesController)
notesRoute.put("/edit-notes", authentication, editNotesController)

export default notesRoute
