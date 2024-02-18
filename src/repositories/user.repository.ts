import { query } from "../utils/db/query"
import { injectable } from "tsyringe"
import { User } from "../entities/user"

type CreateUserProps = {
  phone: string
  passwordHashed: string
}

@injectable()
export class UserRepository {
  createUser = async (props: CreateUserProps): Promise<number | null> => {
    try {
      const { phone, passwordHashed } = props
      const result = await query(
        "INSERT INTO users (phoned, password_hashed) VALUES($1, $2) RETURNING id",
        [phone, passwordHashed]
      )

      const id: number | null = result.rows[0]?.id ?? null
      return id
    } catch (err) {
      console.log("err: ", err)
      return null
    }
  }

  getUserByPhone = async (phone: string): Promise<User | null> => {
    try {
      const result = await query("SELECT * FROM users WHERE phone = $1", [
        phone,
      ])

      // device with such deviceId not found
      if (!result.rows[0]) return null

      const { id, name, password_hashed: password } = result.rows[0]

      return new User({
        id,
        phone,
        name,
        passwordHashed: password,
      })
    } catch (err) {
      // TODO handler error (add logger probably)
      console.log("err: ", err)
      return null
    }
  }

  getUserById = async (userId: number): Promise<User | null> => {
    try {
      const result = await query("SELECT * FROM users WHERE id = $1", [userId])

      // device with such deviceId not found
      if (!result.rows[0]) return null

      const { id, name, phone, password_hashed: password } = result.rows[0]

      return new User({
        id,
        phone,
        name,
        passwordHashed: password,
      })
    } catch (err) {
      // TODO handler error (add logger probably)
      console.log("err: ", err)
      return null
    }
  }
}
