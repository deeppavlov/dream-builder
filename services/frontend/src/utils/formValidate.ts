export const checkIfEnglishOnly = (value: string): boolean => {
  const englishOnlyRegExp = new RegExp(/^[a-zA-Z0-9\s\p{P}.',!-?]+$/)
  return englishOnlyRegExp.test(value)
}
export const checkIfEmptyString = (value: string): boolean => {
  return value.trim().length > 0
}

export const validationRules = {
  checkIfEmptyString: (value: string) =>
    checkIfEmptyString(value) || 'This field cant be empty',
  checkIfEnglishOnly: (value: string) =>
    checkIfEnglishOnly(value) || 'Invalid data',
}
