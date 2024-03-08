import { NoteRequest, NoteForDb as NoteForDb, NoteResponse, Note, EncryptedData } from "../note"

class NoteMapper {
  noteRequestToNoteForDb = (
    noteRequest: Omit<NoteRequest, "metaData.noteGlobalId"> & {
      metaData: { noteGlobalId: string }
    }
  ): NoteForDb => ({
    encryptedTitle: JSON.stringify(noteRequest.data.title),
    encryptedMessage: JSON.stringify(noteRequest.data.message),
    createdAt: noteRequest.metaData.createdAt,
    updatedAt: noteRequest.metaData.updatedAt,
    sendToDeviceId: noteRequest.metaData.sendToDeviceId,
    noteGlobalId: noteRequest.metaData.noteGlobalId,
  })

  noteDbToNote = (noteDbMap: any): Note => ({
    title: JSON.parse(noteDbMap.encrypted_title) as EncryptedData,
    message: JSON.parse(noteDbMap.encrypted_title) as EncryptedData,
    createdAt: noteDbMap.created_at,
    updatedAt: noteDbMap.updated_at,
    sendToDeviceId: noteDbMap.send_to_device_id,
    noteGlobalId: noteDbMap.note_global_id,
    id: noteDbMap.id,
  })

  noteToNoteResponse = (note: Note): NoteResponse => ({
    data: {
      title: note.title,
      message: note.message,
    },
    metaData: {
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      sendToDeviceId: note.sendToDeviceId,
      noteGlobalId: note.noteGlobalId,
    },
  })
}

export const noteMapper = new NoteMapper()
