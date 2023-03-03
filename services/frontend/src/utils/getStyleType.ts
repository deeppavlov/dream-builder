/**
 * Returns first word with lower case and without symbols.
 * For example, "Dictionary — &Pattern-based" will be tranformed to "dictionary".
 */
export const getStyleType = (type: string) =>
  type
    .split(' ')[0]
    .replace(/[^a-zA-Z]/g, '')
    .toLocaleLowerCase()
