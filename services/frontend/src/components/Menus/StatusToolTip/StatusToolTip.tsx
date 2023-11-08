import { BotInfoInterface, ISkill, IStackElement } from 'types/types';
import { examination } from 'utils/checkingAssistants';
import StatusToolTipAsistent from './StatusToolTipAsistent';
import StatusToolTipCard from './StatusToolTipCard';


const StatusToolTip = ({
  name,
  skill,
  skills,
  bot,
}: {
  name: string
  skill?: IStackElement
  skills?: IStackElement[]
  bot?: BotInfoInterface
}) => {
  if (name === 'SkillCard' && skill?.name !== 'dummy_skill' && skill ) {
    return <StatusToolTipCard data={examination(skill)} id={skill?.id} />
  }

  if ('AssistantCard' === name) {
    const result = skills
      ?.filter(el => el.name !== 'dummy_skill')
      .map((el: ISkill) => {
        const resultExamination = examination(el)
        return resultExamination
      })
    return <StatusToolTipAsistent data={result} id={bot?.id} />
  }

  return null
}

export default StatusToolTip