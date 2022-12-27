export const capitalizeTitle = (title: string) => {
  const splittedTitle = title
    .split('_')
    .map(i => {
      return i[0].toUpperCase() + i.slice(1)
    })
    .join(' ')
  return splittedTitle
}
