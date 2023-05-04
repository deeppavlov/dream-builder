import { BotInfoInterface } from '../types/types'

export const sortDistsByISO8601 = (dists: BotInfoInterface[]) =>
  dists?.sort((a, b) => -a.date_created.localeCompare(b.date_created))
