import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { ReactComponent as SkillFallbackIcon } from '../../assets/icons/fallbacks.svg'
import { ReactComponent as SkillScriptIcon } from '@assets/icons/skill_script.svg'
import { ReactComponent as SkillRetrievalIcon } from '@assets/icons/skill_retrieval.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './SkillSidePanel.module.scss'
import { useEffect, useState } from 'react'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { SkillInfoInterface } from '../../types/types'
import ReactTooltip from 'react-tooltip'

interface SkillSidePanelProps extends Partial<SidePanelProps> {
  disabledMsg?: string
}

const SkillSidePanel = ({ position, disabledMsg }: SkillSidePanelProps) => {
  const [skill, setSkill] = useState<SkillInfoInterface | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const handleEventUpdate = (data: { detail: SkillInfoInterface }) => {
    setSkill(data.detail)
    setIsOpen(!isOpen)
  }

  const handleAddSkillBtnClick = () => {
    trigger('CreateSkillModal', skill)
  }

  useEffect(() => {
    subscribe('SkillSidePanel', handleEventUpdate)

    return () => unsubscribe('SkillSidePanel', handleEventUpdate)
  }, [])

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Properties'>
      <div className={`${s.skillSidePanel} ${s[`skillSidePanel_type_${skill?.skillType}`]}`}>
        <div className={s.skillSidePanel__header}>
          <span>{skill?.name}</span>
        </div>
        <div className={s.skillSidePanel__name}>
          {skill?.skillType === 'retrieval' && <SkillRetrievalIcon />}
          {skill?.skillType === 'fallbacks' && <SkillFallbackIcon />}
          <span>{skill?.skillType}</span>
        </div>
        <p className={s.skillSidePanel__desc}>{skill?.desc}</p>
        {/* <Tabs className={s.tabs}>
          <TabList className={s.tabs__list}>
            <Tab className={s.tabs__tab}>Uses</Tab>
            <Tab className={s.tabs__tab} disabled>
              Used by
            </Tab>
          </TabList>
          <TabPanel className={s.tabs__panel}>
            <div className={s.skillSidePanel__accordions}>
              <Accordion title='Annotators' rounded> */}
                {/* <div className={s['skillSidePanel__accordion-item']}>
                  <SkillScriptIcon />
                  DFF Program-Y Skill
                </div>
                <div className={s['skillSidePanel__accordion-item']}>
                  <SkillScriptIcon />
                  DFF Intent Responder Skill
                </div>
                <div className={s['skillSidePanel__accordion-item']}>
                  <FallbackIcon /> Dummy Skill
                </div> */}
              {/* </Accordion>
            </div>
          </TabPanel>
          <TabPanel className={s.tabs__panel}></TabPanel>
        </Tabs> */}

        <div className={s.skillSidePanel__btns}>
          <div data-tip data-for='skill-add-interact' style={{ width: '100%' }}>
            <Button
              theme='primary'
              props={{
                disabled: disabledMsg !== undefined,
                onClick: handleAddSkillBtnClick,
              }}>
              Add Skill
            </Button>
          </div>
        </div>

        {disabledMsg && (
          <ReactTooltip
            place='bottom'
            effect='solid'
            className='tooltips'
            arrowColor='#8d96b5'
            delayShow={1000}
            id='skill-add-interact'>
            {disabledMsg}
          </ReactTooltip>
        )}
      </div>
    </BaseSidePanel>
  )
}

export default SkillSidePanel
