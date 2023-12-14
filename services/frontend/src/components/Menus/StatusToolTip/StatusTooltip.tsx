import { BotInfoInterface, ISkill, IStackElement } from 'types/types'
import { examination } from 'utils/checkingAssistants'
import StatusToolTipAssistant from './StatusTooltipAssistant'
import StatusTooltipSkill from './StatusTooltipSkill'

const StatusToolTip = ({
  name,
  skill,
  skills,
  bot,
}: {
  name: 'skill' | 'assistant'
  skill?: IStackElement
  skills?: IStackElement[]
  bot?: BotInfoInterface
}) => {
  if (name === 'skill' && skill?.name !== 'dummy_skill' && skill) {
    return <StatusTooltipSkill data={examination(skill)} id={skill?.id} />
  }

  if ('assistant' === name) {
    const result = skills
      ?.filter(el => el.name !== 'dummy_skill')
      .map((el: ISkill) => {
        const resultExamination = examination(el)
        return resultExamination
      })
    return <StatusToolTipAssistant data={result} id={bot?.id} />
  }

  return null
}

export default StatusToolTip
