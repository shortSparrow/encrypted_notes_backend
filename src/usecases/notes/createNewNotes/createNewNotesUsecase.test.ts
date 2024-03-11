import { container } from "tsyringe"
import { CreateNewNotesUseCase } from "./createNewNotesUsecase"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { NoteRequest } from "../../../entities/note"
import { createNoteValidationSchema } from "../../../extensions/validation/notes/notes"
import { NotesRepository } from "../../../repositories/notes.repository"
import { AddNewNotesSuccess } from "./createNewNotesUsecase.type"
import { DeviceRepository } from "../../../repositories/device.repository"
import { mockRandomUUID } from "../../../__mock__/uuid"

const mockInvalidNote: NoteRequest = {
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
  },
}

const mockValidNote: NoteRequest = {
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
    sendToDeviceId: "1",
    noteGlobalId: undefined,
  },
}

const mockAddNewNote = jest.fn()
const mockGetDeviceByDeviceId = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<NotesRepository>(NotesRepository, {
    useValue: {
      addNewNote: mockAddNewNote,
    } as unknown as NotesRepository,
  })
  container.register<DeviceRepository>(DeviceRepository, {
    useValue: {
      getDeviceByDeviceId: mockGetDeviceByDeviceId,
    } as unknown as DeviceRepository,
  })
})

describe("createNewNotesUsecase", () => {
  it("Should return error on invalid params", async () => {
    const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

    const result1 = await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [],
      sendFromDeviceId: "device_id_1",
    })
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [{} as NoteRequest],
      sendFromDeviceId: "device_id_1",
    })
    expect(result2).toBeInstanceOf(BadRequestError)

    const result3 = await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [mockInvalidNote],
      sendFromDeviceId: "device_id_1",
    })
    expect(result3).toBeInstanceOf(BadRequestError)

    const invalidNotes = {
      ...mockValidNote,
      metaData: { ...mockValidNote.metaData, noteGlobalId: 1 },
    } as any

    const result4 = await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [invalidNotes],
      sendFromDeviceId: "device_id_1",
    })
    expect(result4).toBeInstanceOf(BadRequestError)
  })

  it("Should handle unexpected errors", async () => {
    const spy = jest
      .spyOn(createNoteValidationSchema, "validate")
      .mockImplementation(() => {
        throw new Error("error")
      })

    const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

    const result = await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [],
      sendFromDeviceId: "device_id_1",
    })
    expect(result).toBeInstanceOf(UnexpectedError)
    spy.mockRestore()
  })

  it("Should return info about is write to DB success and global note id", async () => {
    const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

    const note1: NoteRequest = {
      ...mockValidNote,
      metaData: { ...mockValidNote.metaData, sendToDeviceId: "1" },
    }

    const note2: NoteRequest = {
      ...mockValidNote,
      metaData: { ...mockValidNote.metaData, sendToDeviceId: "2" },
    }

    mockAddNewNote
      .mockImplementationOnce(() => 33)
      .mockImplementationOnce(() => null)

    mockGetDeviceByDeviceId.mockImplementation(() => 10) // return random id - device with device_id=sendToDeviceId exist

    const result = (await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [note1, note2],
      sendFromDeviceId: "device_id_1",
    })) as AddNewNotesSuccess

    expect(result.length).toBe(2)
    expect(result[0]).toEqual({
      sendToDeviceId: note1.metaData.sendToDeviceId,
      isSuccess: true,
      noteGlobalId: mockRandomUUID,
    })
    expect(result[1]).toEqual({
      sendToDeviceId: note2.metaData.sendToDeviceId,
      isSuccess: false,
      noteGlobalId: mockRandomUUID,
    })
  })

  it("Should return isSuccess false for note if note has sendToDeviceId which not exist in DB", async () => {
    const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

    const note1: NoteRequest = {
      ...mockValidNote,
      metaData: { ...mockValidNote.metaData, sendToDeviceId: "1" },
    }

    const note2: NoteRequest = {
      ...mockValidNote,
      metaData: { ...mockValidNote.metaData, sendToDeviceId: "2" },
    }

    mockAddNewNote
      .mockImplementationOnce(() => 33)
      .mockImplementationOnce(() => 34)

    mockGetDeviceByDeviceId
      .mockImplementationOnce(() => null) // device with device_id=sendToDeviceId not exist
      .mockImplementationOnce(() => 10) /// return random id -> device with device_id=sendToDeviceId exist

    const result = (await createNewNotesUseCase.addNewNotes({
      userId: 1,
      notes: [note1, note2],
      sendFromDeviceId: "1",
    })) as AddNewNotesSuccess

    expect(result.length).toBe(2)
    expect(result[0]).toEqual({
      sendToDeviceId: note1.metaData.sendToDeviceId,
      isSuccess: false,
      noteGlobalId: mockRandomUUID,
    })
    expect(result[1]).toEqual({
      sendToDeviceId: note2.metaData.sendToDeviceId,
      isSuccess: true,
      noteGlobalId: mockRandomUUID,
    })
  })
})
