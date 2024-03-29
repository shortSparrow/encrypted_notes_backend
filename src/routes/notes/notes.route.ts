import express from "express"
import { sendNotesController } from "../../controllers/notes/sendNotes.controller"
import { authentication } from "../../middlewares/authentication.middleware"
import { editNotesController } from "../../controllers/notes/editNotes.controller"
import { getAllNotesController } from "../../controllers/notes/getAllNotes.controller"
import { deleteNotesController } from "../../controllers/notes/deleteNotes.controller"

const notesRoute = express.Router()
notesRoute.post("/send-notes", authentication, sendNotesController)
notesRoute.put("/edit-notes", authentication, editNotesController)
notesRoute.delete("/delete-notes", authentication, deleteNotesController)
notesRoute.get("/get-all-notes", authentication, getAllNotesController)

export default notesRoute
