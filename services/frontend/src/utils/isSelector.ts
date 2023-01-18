export const isSelector = (type: string) => {
  const splittedType = type.split('_').slice(1).toString()
  return splittedType === 'selectors'
}
