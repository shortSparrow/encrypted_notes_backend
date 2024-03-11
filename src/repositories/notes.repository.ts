import { injectable } from "tsyringe"
import { Note, NoteForDb } from "../entities/note"
import { query } from "../utils/db/query"
import { TableNames } from "../database/constants"
import { noteMapper } from "../entities/mappers/note"

@injectable()
export class NotesRepository {
  constructor() {}

  addNewNote = async (
    userId: number,
    note: NoteForDb
  ): Promise<number | null> => {
    try {
      const {
        encryptedTitle,
        encryptedMessage,
        createdAt,
        updatedAt,
        sendToDeviceId,
        noteGlobalId,
        sendFromDeviceId,
      } = note

      const result = await query(
        `INSERT INTO ${TableNames.NOTES} (encrypted_title, encrypted_message, created_at, updated_at, send_to_device_id, note_global_id, user_id, send_from_device_id) VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
        [
          encryptedTitle,
          encryptedMessage,
          createdAt,
          updatedAt,
          sendToDeviceId,
          noteGlobalId,
          userId,
          sendFromDeviceId,
        ]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      return null
    }
  }

  editNote = async (
    userId: number,
    note: NoteForDb
  ): Promise<null | number> => {
    try {
      const {
        encryptedTitle,
        encryptedMessage,
        createdAt,
        updatedAt,
        sendToDeviceId,
        noteGlobalId,
        sendFromDeviceId,
      } = note

      const result = await query(
        `UPDATE ${TableNames.NOTES} SET encrypted_title=$1, encrypted_message=$2, created_at=$3, updated_at=$4, send_to_device_id=$5, send_from_device_id=$6 WHERE note_global_id=$7 AND user_id=$8 AND send_to_device_id=$9 RETURNING id`,
        [
          encryptedTitle,
          encryptedMessage,
          createdAt,
          updatedAt,
          sendToDeviceId,
          sendFromDeviceId,
          noteGlobalId,
          userId,
          sendToDeviceId,
        ]
      )

      const data = result.rows[0]

      if (!data) return null

      return data.id
    } catch (e) {
      console.log("Err: ", e)
      return null
    }
  }

  deleteNotes = async (userId: number, globalNoteId: string): Promise<boolean> => {
    try {
      const result = await query(
        `DELETE FROM ${TableNames.NOTES} WHERE user_id=$1 AND note_global_id=$2 RETURNING id`,
        [userId, globalNoteId]
      )

      return result.rows[0] != null
    } catch (e) {
      console.log("Err: ", e)
      return false
    }
  }

  getAllNotes = async (userId: number, deviceId: string): Promise<Note[]> => {
    try {
      const result = await query(
        `SELECT * FROM ${TableNames.NOTES} WHERE user_id=$1 AND send_to_device_id=$2`,
        [userId, deviceId]
      )

      return result.rows.map((item) => noteMapper.noteDbToNote(item))
    } catch (e) {
      console.log("Err: ", e)
      return []
    }
  }

  getNotesByGlobalId = async (
    userId: number,
    noteGlobalId: string
  ): Promise<Note[]> => {
    try {
      const result = await query(
        `SELECT * FROM ${TableNames.NOTES} WHERE user_id=$1 AND note_global_id=$2`,
        [userId, noteGlobalId]
      )

      return result.rows.map((item) => noteMapper.noteDbToNote(item))
    } catch (e) {
      console.log("Err: ", e)
      return []
    }
  }
}
