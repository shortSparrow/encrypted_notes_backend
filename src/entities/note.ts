export type EncryptedData = {
  cipherText: number[]
  nonce: number[]
  mac: number[]
}

export type Note = {
  title: EncryptedData
  message: EncryptedData
  createdAt: string
  updatedAt: string
  sendToDeviceId: string
  noteGlobalId: string
  id: number
}

export type NoteRequest = {
  data: {
    title: EncryptedData
    message: EncryptedData
  }
  metaData: {
    createdAt: string
    updatedAt: string
    sendToDeviceId: string
    noteGlobalId?: string
  }
}

export type NoteResponse = {
  data: {
    title: EncryptedData
    message: EncryptedData
  }
  metaData: {
    createdAt: string
    updatedAt: string
    sendToDeviceId: string
    noteGlobalId: string
  }
}

export type NoteForDb = {
  encryptedTitle: string
  encryptedMessage: string
  createdAt: string
  updatedAt: string
  sendToDeviceId: string
  noteGlobalId: string
}
