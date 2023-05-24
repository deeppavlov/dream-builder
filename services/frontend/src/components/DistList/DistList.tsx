import { FC } from 'react'
import { useAuth } from '../../context/AuthProvider'
import { DistListProps } from '../../types/types'
import { sortByISO8601 } from '../../utils/sortByISO8601'
import { AssistantCard } from '../AssistantCard/AssistantCard'
import { AssistantListItem } from '../AssistantListItem/AssistantListItem'

export const DistList: FC<DistListProps> = ({ view, dists, type, size }) => {
  const auth = useAuth()
  const disabled = !auth?.user

  return (
    <>
      {sortByISO8601(dists)?.map((bot, i: number) => {
        return view == 'table' ? (
          <AssistantListItem
            key={i}
            bot={bot}
            type={type}
            disabled={disabled}
          />
        ) : (
          <AssistantCard
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
