import { container } from "tsyringe"

import { NotesRepository } from "../../../repositories/notes.repository"
import { BadRequestError } from "../../../entities/errors"
import { mockRandomUUID } from "../../../__mock__/uuid"
import { DeleteNoteUsecase } from "./deleteNoteUsecase"

const mockDeleteNotes = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  container.clearInstances()
  container.register<NotesRepository>(NotesRepository, {
    useValue: {
      deleteNotes: mockDeleteNotes,
    } as unknown as NotesRepository,
  })
})

describe("DeleteNoteUsecase", () => {
  it("should return error if props invalid", async () => {
    const deleteNoteUsecase = container.resolve(DeleteNoteUsecase)
    const result1 = await deleteNoteUsecase.deleteNotes(
      1,
      "some invalid structure"
    )
    expect(result1).toBeInstanceOf(BadRequestError)

    const result2 = await deleteNoteUsecase.deleteNotes(
      1,
      undefined as unknown as string
    )
    expect(result2).toBeInstanceOf(BadRequestError)
  })

  it("should return false if the note deletion failed", async () => {
    const deleteNoteUsecase = container.resolve(DeleteNoteUsecase)
    mockDeleteNotes.mockImplementation(() => false)
    const result = await deleteNoteUsecase.deleteNotes(1, mockRandomUUID)
    expect(result).toBe(false)
  })

  it("should true false if the note deletion successfully", async () => {
    const deleteNoteUsecase = container.resolve(DeleteNoteUsecase)
    mockDeleteNotes.mockImplementation(() => true)
    const result = await deleteNoteUsecase.deleteNotes(1, mockRandomUUID)
    expect(result).toBe(true)
  })
})
