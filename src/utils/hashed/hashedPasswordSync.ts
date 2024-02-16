import bcrypt from "bcrypt"

const SALT_ROUND = 10

export const hashPasswordSync = (password: string): string =>
  bcrypt.hashSync(password, SALT_ROUND)

export const comparePasswordSync = ({
  userPassword,
  dbPassword,
}: {
  userPassword: string
  dbPassword: string
}): boolean => {
  return bcrypt.compareSync(userPassword, dbPassword)
}
