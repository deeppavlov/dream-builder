export const isAnnotator = (type: string) => {
  return (
    type == 'annotators' ||
    type === 'candidate_annotators' ||
    type == 'response_annotators'
  )
}
