import { container } from "tsyringe"
import { CreateNewNotesUseCase } from "./createNewNotesUsecase"
import { BadRequestError, UnexpectedError } from "../../../entities/errors"
import { NoteRequest } from "../../../entities/note"
import { createNoteValidationSchema } from "../../../extensions/validation/notes/notes"
import { NotesRepository } from "../../../repositories/notes.repository"
import { AddNewNotesSuccess } from "./createNewNotesUsecase.type"

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

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<NotesRepository>(NotesRepository, {
    useValue: {
      addNewNote: mockAddNewNote,
    } as unknown as NotesRepository,
  })
})

describe("createNewNotesUsecase", () => {
  it("Should return error on invalid params", async () => {
    const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

    const result1 = await createNewNotesUseCase.addNewNotes([])
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await createNewNotesUseCase.addNewNotes([{} as NoteRequest])
    expect(result2).toBeInstanceOf(BadRequestError)

    const result3 = await createNewNotesUseCase.addNewNotes([mockInvalidNote])
    expect(result3).toBeInstanceOf(BadRequestError)

    const invalidNotes = ({ ...mockValidNote }.metaData.noteGlobalId = 1 as any)
    const result4 = await createNewNotesUseCase.addNewNotes(invalidNotes)
    expect(result4).toBeInstanceOf(BadRequestError)
  })

  it("Should handle unexpected errors", async () => {
    const spy = jest
      .spyOn(createNoteValidationSchema, "validate")
      .mockImplementation(() => {
        throw new Error("error")
      })

    const createNewNotesUseCase = container.resolve(CreateNewNotesUseCase)

    const result = await createNewNotesUseCase.addNewNotes([])
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

    const result = (await createNewNotesUseCase.addNewNotes([
      note1,
      note2,
    ])) as AddNewNotesSuccess

    expect(typeof result.noteGlobalId).toBe("string")
    expect(result.noteGlobalId.length).toBe(36)

    expect(result.resultInfo.length).toBe(2)
    expect(result.resultInfo[0]).toEqual({
      deviceId: note1.metaData.sendToDeviceId,
      isSuccess: true,
    })
    expect(result.resultInfo[1]).toEqual({
      deviceId: note2.metaData.sendToDeviceId,
      isSuccess: false,
    })
  })
})
