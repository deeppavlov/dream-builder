import { FC } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { BotInfoInterface, DistListProps } from '../../types/types'
import { BotCard } from '../BotCard/BotCard'
import { BotListItem } from '../BotListItem/BotListItem'

export const DistList: FC<DistListProps> = ({ view, dists, type, size }) => {
  const auth = useAuth()
  const disabled = !auth?.user
  return (
    <>
      {dists?.map((bot: BotInfoInterface, i: number) => {
        return view == 'table' ? (
          <BotListItem
            key={i}
            bot={bot}
            type={type}
            disabled={ disabled}
          />
        ) : (
          <BotCard key={i} bot={bot} size={size} type={type} disabled={disabled} />
        )
      })}
    </>
  )
}
