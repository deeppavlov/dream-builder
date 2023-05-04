import { FC } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { DistListProps } from '../../types/types'
import { sortDistsByISO8601 } from '../../utils/sortDistsByISO8601'
import { BotCard } from '../BotCard/BotCard'
import { BotListItem } from '../BotListItem/BotListItem'

export const DistList: FC<DistListProps> = ({ view, dists, type, size }) => {
  const auth = useAuth()
  const disabled = !auth?.user

  return (
    <>
      {sortDistsByISO8601(dists)?.map((bot, i) => {
        return view == 'table' ? (
          <BotListItem key={i} bot={bot} type={type} disabled={disabled} />
        ) : (
          <BotCard
            key={i}
            bot={bot}
            size={size}
            type={type}
            disabled={disabled}
          />
        )
      })}
    </>
  )
}
