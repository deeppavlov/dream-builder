import { IFeedback } from 'types/types'

export const sortFeedbackItems = (
  items: IFeedback[],
  param: 'date' | 'type' | 'status',
  isAscending: boolean
) => {
  return items.sort((itemA, itemB) => {
    const a =
      param === 'date'
        ? new Date(itemA.date_created).getTime()
        : itemA[param].id
    const b =
      param === 'date'
        ? new Date(itemB.date_created).getTime()
        : itemB[param].id

    if (!a) return isAscending ? -1 : 1
    if (!b) return isAscending ? 1 : -1

    return isAscending ? a - b : b - a
  })
}
