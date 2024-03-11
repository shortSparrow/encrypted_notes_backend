import {
  NoteRequest,
  NoteForDb,
  NoteResponse,
  Note,
  EncryptedData,
} from "../note"

class NoteMapper {
  noteRequestToNoteForDb = (
    noteRequest: Omit<NoteRequest, "metaData.noteGlobalId"> & {
      metaData: { noteGlobalId: string }
    },
    sendFromDeviceId: string
  ): NoteForDb => ({
    encryptedTitle: JSON.stringify(noteRequest.data.title),
    encryptedMessage: JSON.stringify(noteRequest.data.message),
    createdAt: noteRequest.metaData.createdAt,
    updatedAt: noteRequest.metaData.updatedAt,
    sendToDeviceId: noteRequest.metaData.sendToDeviceId,
    noteGlobalId: noteRequest.metaData.noteGlobalId,
    sendFromDeviceId: sendFromDeviceId,
  })

  noteDbToNote = (noteDbMap: any): Note => ({
    title: JSON.parse(noteDbMap.encrypted_title) as EncryptedData,
    message: JSON.parse(noteDbMap.encrypted_message) as EncryptedData,
    createdAt: noteDbMap.created_at,
    updatedAt: noteDbMap.updated_at,
    sendToDeviceId: noteDbMap.send_to_device_id,
    noteGlobalId: noteDbMap.note_global_id,
    id: noteDbMap.id,
    sendFromDeviceId: noteDbMap.send_from_device_id,
  })

  noteToNoteResponse = (note: Note, syncedWithDeviceId: string[]): NoteResponse => ({
    data: {
      title: note.title,
      message: note.message,
    },
    metaData: {
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
      sendToDeviceId: note.sendToDeviceId,
      noteGlobalId: note.noteGlobalId,
      sendFromDeviceId: note.sendFromDeviceId,
      syncedWithDevices: syncedWithDeviceId
    },
  })
}

export const noteMapper = new NoteMapper()
