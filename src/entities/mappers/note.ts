import { NoteRequest, NoteDb } from "../note"

class NoteMapper {
  noteRequestToNoteDb = (
    noteRequest: Omit<NoteRequest, "metaData.noteGlobalId"> & {
      metaData: { noteGlobalId: string }
    }
  ): NoteDb => ({
    data: {
      encryptedTitle: JSON.stringify(noteRequest.data.title),
      encryptedMessage: JSON.stringify(noteRequest.data.message),
    },
    metaData: {
      createdAt: noteRequest.metaData.createdAt,
      updatedAt: noteRequest.metaData.updatedAt,
      sendToDeviceId: noteRequest.metaData.sendToDeviceId,
      noteGlobalId: noteRequest.metaData.noteGlobalId,
    },
  })

  //   noteDbToNoteDto = (noteDto: NoteDb): NoteDTO => ({})
}

export const noteMapper = new NoteMapper()
