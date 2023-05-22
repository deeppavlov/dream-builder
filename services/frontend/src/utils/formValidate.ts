import { validationSchema } from './validationSchema'

export const checkIfEmptyString = (value: string) =>
  !(value.trim().length > 0) ? validationSchema.global.required : undefined

export const validationRules = (value: string) => {
  return checkIfEmptyString(value)
}
