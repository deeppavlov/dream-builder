import { useEffect, useState } from 'react'
import { useAssistants } from '../../hooks/useAssistants'
import { BotAvailabilityType, BotInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import DumbAssistantSP from './DumbAssitantSP'

interface Props {
  name: string
  disabled?: boolean
  type: BotAvailabilityType
}

const AssistantSidePanel = ({ name, disabled, type }: Props) => {
  const { getDist } = useAssistants()
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const { data: dist } = getDist(name)

  useEffect(() => {
    if (dist) return setBot(dist)
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
    setBot(null)
  }, [dist])

  return <DumbAssistantSP bot={bot!} disabled={disabled} type={type} />
}

export default AssistantSidePanel
