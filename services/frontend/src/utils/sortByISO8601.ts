import { BotInfoInterface, IPublicationRequest } from '../types/types'

type SortableArray<T> = T extends BotInfoInterface[]
  ? BotInfoInterface[]
  : T extends IPublicationRequest[]
  ? IPublicationRequest[]
  : never

export const sortByISO8601 = <
  T extends BotInfoInterface[] | IPublicationRequest[]
>(
  arr: T
) => {
  return arr?.sort(
    (a, b) => -a.date_created.localeCompare(b.date_created)
  ) as SortableArray<T>
}
