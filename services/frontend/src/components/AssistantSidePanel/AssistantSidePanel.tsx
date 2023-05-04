import { useEffect } from 'react'
import { useAssistants } from '../../hooks/useAssistants'
import { BotAvailabilityType } from '../../types/types'
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
  const { data: dist } = getDist(name)

  useEffect(() => {
    if (!dist) trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }, [dist])

  return <DumbAssistantSP bot={dist} disabled={disabled} type={type} />
}

export default AssistantSidePanel
