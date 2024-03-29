import { ReactComponent as LeftArrowIcon } from 'assets/icons/arrow_right_link.svg'
import { ISkill, SkillAvailabilityType } from 'types/types'
import { trigger } from 'utils/events'
import triggerSkillSidePanel from 'utils/triggerSkillSidePanel'
import { Button } from 'components/Buttons'
import {
  SidePanelButtons,
  SidePanelHeader,
  SidePanelName,
} from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './ReadFirstSidePanel.module.scss'

interface IProps {
  skill?: ISkill
  distName?: string
  activeTab?: 'properties' | 'details'
  visibility?: SkillAvailabilityType
}

const ReadFirstSidePanel = ({
  skill,
  distName,
  activeTab,
  visibility,
}: IProps) => {
  const isProps = skill && distName && activeTab && visibility

  const handleBackClick = () => {
    if (!isProps) return trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

    triggerSkillSidePanel({
      skill,
      distName,
      activeTab,
      visibility,
      isOpen: true,
    })
  }

  return (
    <div className={s.readFirst}>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' aria-selected>
            Important
          </li>
        </ul>
      </SidePanelHeader>
      <div className={s['sidepanel-name']}>
        <SidePanelName>
          Your AI assistant is multi-skill which means that at each step in the
          conversation your Assistant picks the skill to create the response
        </SidePanelName>
      </div>
      <div className={s.explanation}>
        <span>How it works:</span>
        <p>
          To make it easier for your AI assistant to choose the right skill, you
          should explain it what each of your skills can be used for. Enter
          explanation into skill’s description.
        </p>
      </div>
      <div className={s.examples}>
        <span className={s['examples-title']}>Examples:</span>
        <ul className={s.list}>
          <li className={s.item}>
            <span className={s['item-name']}>Persona Skill</span>
            <p>Useful for when user asks about your assistant's persona</p>
          </li>
          <li className={s.item}>
            <span className={s['item-name']}>
              Meeting Notes Summarizer Skill
            </span>
            <p>Useful for when user asks to summarize your meeting notes</p>
          </li>
        </ul>
      </div>
      {isProps && (
        <SidePanelButtons>
          <div className={s.backBtn}>
            <Button theme='secondary' props={{ onClick: handleBackClick }}>
              <LeftArrowIcon className={s.icon} />
              Back to skill
            </Button>
          </div>
        </SidePanelButtons>
      )}
    </div>
  )
}

export default ReadFirstSidePanel
