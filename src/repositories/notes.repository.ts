import { injectable } from "tsyringe"
import { NoteDb } from "../entities/note"
import { query } from "../utils/db/query"
import { TableNames } from "../database/constants"

@injectable()
export class NotesRepository {
  constructor() {}

  addNewNote = async (note: NoteDb): Promise<string | null> => {
    try {
      const {
        data: { encryptedTitle, encryptedMessage },
        metaData: { createdAt, updatedAt, sendToDeviceId, noteGlobalId },
      } = note
      const result = await query(
        `INSERT INTO ${TableNames.NOTES} (encrypted_title, encrypted_message, created_at, updated_at, send_to_device_id, note_global_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING id`,
        [
          encryptedTitle,
          encryptedMessage,
          createdAt,
          updatedAt,
          sendToDeviceId,
          noteGlobalId,
        ]
      )

      return result.rows[0]?.id ?? null
    } catch (err) {
      return null
    }
  }
}
