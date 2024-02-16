class ResponseError extends Error {
  code: number
  constructor(code: number, message?: string) {
    super(message)
    this.code = code
  }
}

export class FailedToCreateError extends ResponseError {
  constructor(message?: string, code = 520) {
    super(code, message)
  }
}

export class ConflictError extends ResponseError {
  constructor(message?: string, code = 409) {
    super(code, message)
  }
}

export class UnknownError extends ResponseError {
  constructor(message?: string, code = 520) {
    super(code, message)
  }
}

export class NotFoundError extends ResponseError {
  constructor(message?: string, code = 404) {
    super(code, message)
  }
}

export class UnauthorizedError extends ResponseError {
  constructor(message?: string, code = 401) {
    super(code, message)
  }
}

export class BadRequestError extends ResponseError {
  constructor(message?: string, code = 400) {
    super(code, message)
  }
}
