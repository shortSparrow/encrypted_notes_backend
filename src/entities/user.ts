type Props = {
  id: number
  phone: string
  name?: string
  passwordHashed: string
}

export class User {
  id: number
  phone: string
  name?: string
  hashedPassword: string

  constructor({ id, phone, name, passwordHashed: hashedPassword }: Props) {
    this.id = id
    this.phone = phone
    this.name = name
    this.hashedPassword = hashedPassword
  }
}
