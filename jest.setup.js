require("reflect-metadata")
require("jsonwebtoken")

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn(),
}))
