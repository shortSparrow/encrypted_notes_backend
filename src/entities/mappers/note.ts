import { NoteDTO, NoteDb } from "../note"

class NoteMapper {
  noteDtoToNoteDb = (
    noteDto: Omit<NoteDTO, "metaData.noteGlobalId"> & {
      metaData: { noteGlobalId: string }
    }
  ): NoteDb => ({
    data: {
      encryptedTitle: JSON.stringify(noteDto.data.title),
      encryptedMessage: JSON.stringify(noteDto.data.message),
    },
    metaData: {
      createdAt: noteDto.metaData.createdAt,
      updatedAt: noteDto.metaData.updatedAt,
      sendToDeviceId: noteDto.metaData.sendToDeviceId,
      noteGlobalId: noteDto.metaData.noteGlobalId,
    },
  })

  //   noteDbToNoteDto = (noteDto: NoteDb): NoteDTO => ({})
}

export const noteMapper = new NoteMapper()
