import { BotInfoInterface, IPublicationRequest } from '../types/types'

type ArrayType<T> = T extends (infer BotInfoInterface | IPublicationRequest)[]
  ? BotInfoInterface
  : T

type t = ArrayType<[IPublicationRequest]>

type BotOrRequest<T extends BotInfoInterface[] | IPublicationRequest[]> =
  T extends BotInfoInterface[] ? BotInfoInterface[] : IPublicationRequest[]

export function sortDistsByISO8601<
  T extends BotInfoInterface[] | IPublicationRequest[]
>(dists: T): BotOrRequest<T> {
  const list = dists?.sort(
    (a, b) => -a.date_created.localeCompare(b.date_created)
  )
  return list
}
