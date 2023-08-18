import { useAuth } from 'context'
import { FC, useEffect, useState } from 'react'
import { BotInfoInterface, DistListProps } from 'types/types'
import { sortAssistantBylang } from 'utils/SortAssistantByLang'
import { currentLocale } from 'utils/getLangFromStorage'
import { AssistantCard } from 'components/Cards'
import { AssistantListItem } from 'components/Tables'

export const DistList: FC<DistListProps> = ({ view, dists, type, size }) => {
  const auth = useAuth()
  const locale = currentLocale()
  const disabled = !auth?.user
  const [sortedDists, setSortedDists] = useState<BotInfoInterface[]>([])

  const handleLangChange = () =>
    dists && setSortedDists([...sortAssistantBylang(dists, locale)])

  useEffect(() => {
    handleLangChange()
  }, [dists, locale])

  return (
    <>
      {sortedDists?.map(bot =>
        view === 'table' ? (
          <AssistantListItem
            key={bot?.name}
            bot={bot}
            type={type}
            disabled={disabled}
          />
        ) : (
          <AssistantCard
            key={bot?.name}
            bot={bot}
            size={size}
            type={type}
            disabled={disabled}
          />
        )
      )}
    </>
  )
}
