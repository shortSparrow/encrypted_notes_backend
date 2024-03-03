export type NoteDTO = {
  data: {
    title: {
      cipherText: number[]
      nonce: number[]
      mac: number[]
    }
    message: {
      cipherText: number[]
      nonce: number[]
      mac: number[]
    }
  }
  metaData: {
    createdAt: string
    updatedAt: string
    sendToDeviceId: string
    noteGlobalId?: string
  }
}

export type NoteDb = {
  data: {
    encryptedTitle: string
    encryptedMessage: string
  }
  metaData: {
    createdAt: string
    updatedAt: string
    sendToDeviceId: string
    noteGlobalId: string
  }
}
