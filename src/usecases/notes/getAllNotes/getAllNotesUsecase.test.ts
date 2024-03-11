import { container } from "tsyringe"
import { GetAllNotesUsecase } from "./getAllNotesUsecase"
import { NotesRepository } from "../../../repositories/notes.repository"
import { Note, NoteResponse } from "../../../entities/note"

const mockGetAllNotes = jest.fn()
const mockGetNotesByGlobalId = jest.fn()

const mockNote: Note = {
  id: 0,
  title: {
    cipherText: [1],
    nonce: [2],
    mac: [3],
  },
  message: {
    cipherText: [4],
    nonce: [5],
    mac: [6],
  },
  createdAt: "",
  updatedAt: "",
  sendToDeviceId: "",
  noteGlobalId: "",
  sendFromDeviceId: "",
}

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<NotesRepository>(NotesRepository, {
    useValue: {
      getAllNotes: mockGetAllNotes,
      getNotesByGlobalId: mockGetNotesByGlobalId,
    } as unknown as NotesRepository,
  })
})

describe("GetAllNotesUsecase", () => {
  it("should return note object with syncedWithDevices array for each requested note", async () => {
    const getAllNotesUsecase = container.resolve(GetAllNotesUsecase)

    const mockNote1 = {
      ...mockNote,
      noteGlobalId: "global_id_1",
    }
    const mockNote2 = {
      ...mockNote,
      noteGlobalId: "global_id_2",
    }

    mockGetAllNotes.mockImplementation(() => [mockNote1, mockNote2])
    mockGetNotesByGlobalId.mockImplementation(() => [
      { sendToDeviceId: "device_1" },
      { sendToDeviceId: "device_2" },
      { sendToDeviceId: "device_3" },
    ])

    const result = (await getAllNotesUsecase.getAllNotes(
      5,
      "device_1"
    )) as NoteResponse[]

    expect(mockGetNotesByGlobalId).toHaveBeenCalledTimes(2)
    expect(mockGetNotesByGlobalId).toHaveBeenNthCalledWith(1, 5, "global_id_1")
    expect(mockGetNotesByGlobalId).toHaveBeenNthCalledWith(2, 5, "global_id_2")

    expect(result[0]).toEqual({
      data: {
        title: mockNote1.title,
        message: mockNote1.message,
      },
      metaData: {
        createdAt: mockNote1.createdAt,
        updatedAt: mockNote1.updatedAt,
        sendToDeviceId: mockNote1.sendToDeviceId,
        noteGlobalId: mockNote1.noteGlobalId,
        sendFromDeviceId: mockNote1.sendFromDeviceId,
        syncedWithDevices: ["device_1", "device_2", "device_3"],
      },
    })

    expect(result[1]).toEqual({
      data: {
        title: mockNote2.title,
        message: mockNote2.message,
      },
      metaData: {
        createdAt: mockNote2.createdAt,
        updatedAt: mockNote2.updatedAt,
        sendToDeviceId: mockNote2.sendToDeviceId,
        noteGlobalId: mockNote2.noteGlobalId,
        sendFromDeviceId: mockNote2.sendFromDeviceId,
        syncedWithDevices: ["device_1", "device_2", "device_3"],
      },
    })
  })
})
