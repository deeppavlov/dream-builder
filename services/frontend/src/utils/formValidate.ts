export const checkEnglishRexExp = (value: string) => {
  const engRexExp = new RegExp(/^[a-zA-Z0-9\s\p{P}.'’,!-?]+$/gi)
  return !engRexExp.test(value) && 'Invalid data'
}
export const checkIfEmptyString = (value: string) => {
  return !(value.trim().length > 0) && "This field can't be empty"
}

export const validationRules = (value: string) => {
  return checkEnglishRexExp(value) || undefined
}
