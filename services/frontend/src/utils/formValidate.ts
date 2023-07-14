import { getValidationSchema } from './getValidationSchema'

export const checkIfEmptyString = (value: string, t: Function) =>
  !(value.trim().length > 0) ? getValidationSchema().global.required : undefined

export const validationRules = (value: string) => {
  return checkIfEmptyString(value)
}
