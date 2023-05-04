import { useAssistants } from '../../hooks/useAssistants'
import { BotAvailabilityType } from '../../types/types'
import DumbAssistantSP from './DumbAssitantSP'

interface Props {
  name: string
  disabled?: boolean
  type: BotAvailabilityType
}

const AssistantSidePanel = ({ name, disabled, type }: Props) => {
  const { getDist } = useAssistants()
  const { data: dist } = getDist(name)
  console.log(dist)

  return <DumbAssistantSP bot={dist} disabled={disabled} type={type} />
}

export default AssistantSidePanel
