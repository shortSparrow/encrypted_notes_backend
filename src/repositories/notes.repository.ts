import { injectable } from "tsyringe"
import { NoteDb } from "../entities/note"
import { query } from "../utils/db/query"
import { TableNames } from "../database/constants"

@injectable()
export class NotesRepository {
  constructor() {}

  addNewNote = async (userId: number, note: NoteDb): Promise<number | null> => {
    try {
      const {
        data: { encryptedTitle, encryptedMessage },
        metaData: { createdAt, updatedAt, sendToDeviceId, noteGlobalId },
      } = note
      const result = await query(
        `INSERT INTO ${TableNames.NOTES} (encrypted_title, encrypted_message, created_at, updated_at, send_to_device_id, note_global_id, user_id) VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
        [
          encryptedTitle,
          encryptedMessage,
          createdAt,
          updatedAt,
          sendToDeviceId,
          noteGlobalId,
          userId,
        ]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      return null
    }
  }

  editNote = async (userId: number, note: NoteDb): Promise<number | null> => {
    try {
      const {
        data: { encryptedTitle, encryptedMessage },
        metaData: { createdAt, updatedAt, sendToDeviceId, noteGlobalId },
      } = note
      console.log("noteGlobalId: ", noteGlobalId)
      const result = await query(
        `UPDATE ${TableNames.NOTES} SET encrypted_title=$1, encrypted_message=$2, created_at=$3, updated_at=$4 WHERE note_global_id=$5 AND send_to_device_id=$6 AND user_id=$7 RETURNING id`,
        [
          encryptedTitle,
          encryptedMessage,
          createdAt,
          updatedAt,
          noteGlobalId,
          sendToDeviceId,
          userId,
        ]
      )
      return result.rows[0]?.id ?? null
    } catch (e) {
      console.log('Err: ', e)
      return null
    }
  }
}
