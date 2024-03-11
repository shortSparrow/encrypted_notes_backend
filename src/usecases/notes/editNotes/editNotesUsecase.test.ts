import { container } from "tsyringe"
import { EditNotesUseCase } from "./editNotesUsecase"
import { DeviceRepository } from "../../../repositories/device.repository"
import { NotesRepository } from "../../../repositories/notes.repository"
import { BadRequestError } from "../../../entities/errors"
import { EditNotesRequest, EditNotesSuccess } from "./editNotesUsecase.type"

const mockInvalidNote: EditNotesRequest = {
  data: {
    title: {
      cipherText: [],
      nonce: [],
      mac: [],
    },
    message: {
      cipherText: [],
      nonce: [],
      mac: [],
    },
  },
  metaData: {
    createdAt: "1",
    updatedAt: "1",
    sendToDeviceId: "1",
    noteGlobalId: undefined as unknown as string,
  },
}

const mockValidNote: EditNotesRequest = {
  data: {
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
  },
  metaData: {
    createdAt: "1",
    updatedAt: "1",
    sendToDeviceId: "device_1",
    noteGlobalId: "global_id_1",
  },
}

const mockEditNote = jest.fn()
const mockGetDeviceByDeviceId = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<NotesRepository>(NotesRepository, {
    useValue: {
      editNote: mockEditNote,
    } as unknown as NotesRepository,
  })
  container.register<DeviceRepository>(DeviceRepository, {
    useValue: {
      getDeviceByDeviceId: mockGetDeviceByDeviceId,
    } as unknown as DeviceRepository,
  })
})

describe("EditNoteUsecase", () => {
  it("should return BadRequest if updatedNotes invalid", async () => {
    const editNotesUseCase = container.resolve(EditNotesUseCase)
    const result1 = await editNotesUseCase.editNotes({
      updatedNotes: [],
      userId: 1,
      sendFromDeviceId: "device_1",
    })
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await editNotesUseCase.editNotes({
      updatedNotes: [mockInvalidNote],
      userId: 1,
      sendFromDeviceId: "device_1",
    })
    expect(result2).toBeInstanceOf(BadRequestError)

    const result3 = await editNotesUseCase.editNotes({
      updatedNotes: [mockValidNote, mockInvalidNote],
      userId: 1,
      sendFromDeviceId: "device_1",
    })
    expect(result3).toBeInstanceOf(BadRequestError)

    const result4 = await editNotesUseCase.editNotes({
      updatedNotes: [
        {
          ...mockValidNote,
          metaData: {
            ...mockValidNote.metaData,
            noteGlobalId: 1 as unknown as string,
          },
        },
      ],
      userId: 1,
      sendFromDeviceId: "device_1",
    })
    expect(result4).toBeInstanceOf(BadRequestError)
  })

  it("should return isSuccess false for each note if sendToDeviceId not exist", async () => {
    const editNotesUseCase = container.resolve(EditNotesUseCase)

    mockGetDeviceByDeviceId.mockImplementation(() => null)

    const result = (await editNotesUseCase.editNotes({
      updatedNotes: [
        {
          ...mockValidNote,
          metaData: { ...mockValidNote.metaData, sendToDeviceId: "device_2" },
        },
        {
          ...mockValidNote,
          metaData: { ...mockValidNote.metaData, sendToDeviceId: "device_3" },
        },
      ],
      userId: 1,
      sendFromDeviceId: "device_1",
    })) as EditNotesSuccess

    expect(mockGetDeviceByDeviceId).toHaveBeenCalledWith({
      deviceId: "device_2",
      userId: 1,
    })

    expect(mockGetDeviceByDeviceId).toHaveBeenCalledWith({
      deviceId: "device_3",
      userId: 1,
    })

    expect(result.length).toBe(2)

    expect(result[0]).toEqual({
      sendToDeviceId: "device_2",
      noteGlobalId: mockValidNote.metaData.noteGlobalId,
      isSuccess: false,
    })

    expect(result[1]).toEqual({
      sendToDeviceId: "device_3",
      noteGlobalId: mockValidNote.metaData.noteGlobalId,
      isSuccess: false,
    })
  })

  it("should return isSuccess false for note whose recipient to exist, and isSuccess true for whose recipient exist", async () => {
    const editNotesUseCase = container.resolve(EditNotesUseCase)

    mockGetDeviceByDeviceId
      .mockImplementationOnce(() => null)
      .mockImplementationOnce(() => true)

    mockEditNote.mockImplementation(() => 22) // return random id - emulate success editing

    const result = (await editNotesUseCase.editNotes({
      updatedNotes: [
        {
          ...mockValidNote,
          metaData: { ...mockValidNote.metaData, sendToDeviceId: "device_2" },
        },
        {
          ...mockValidNote,
          metaData: { ...mockValidNote.metaData, sendToDeviceId: "device_3" },
        },
      ],
      userId: 1,
      sendFromDeviceId: "device_1",
    })) as EditNotesSuccess

    expect(mockGetDeviceByDeviceId).toHaveBeenCalledWith({
      deviceId: "device_2",
      userId: 1,
    })

    expect(mockGetDeviceByDeviceId).toHaveBeenCalledWith({
      deviceId: "device_3",
      userId: 1,
    })

    expect(result.length).toBe(2)

    expect(result[0]).toEqual({
      sendToDeviceId: "device_2",
      noteGlobalId: mockValidNote.metaData.noteGlobalId,
      isSuccess: false,
    })

    expect(result[1]).toEqual({
      sendToDeviceId: "device_3",
      noteGlobalId: mockValidNote.metaData.noteGlobalId,
      isSuccess: true,
    })
  })

})
