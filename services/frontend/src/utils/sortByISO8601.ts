import {
  BotInfoInterface,
  IDeploymentStatus,
  IPublicationRequest,
} from '../types/types'

type SortableArray<T> = T extends BotInfoInterface[]
  ? BotInfoInterface[]
  : T extends IPublicationRequest[]
  ? IPublicationRequest[]
  : IDeploymentStatus[]

export const sortByISO8601 = <
  T extends BotInfoInterface[] | IPublicationRequest[] | IDeploymentStatus[]
>(
  arr: T
) => {
  return arr?.sort(
    (a, b) => -a.date_created.localeCompare(b.date_created)
  ) as SortableArray<T>
}
