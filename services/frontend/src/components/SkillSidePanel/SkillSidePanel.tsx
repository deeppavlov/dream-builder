import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'
import { ReactComponent as FallbackIcon } from '@assets/icons/fallbacks.svg'
import { ReactComponent as SkillScriptIcon } from '@assets/icons/skill_script.svg'
import { ReactComponent as SkillRetrievalIcon } from '@assets/icons/skill_retrieval.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './SkillSidePanel.module.scss'

const SkillSidePanel = ({ isOpen, setIsOpen, position }: SidePanelProps) => {
  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Properties'>
      <div className={s.skillSidePanel}>
        <div className={s.skillSidePanel__header}>
          <span className={s['annotatorSidePanel__header-title']}>Skills:</span>
          <span>DFF Intent Responder Skill</span>
        </div>
        <div className={s.skillSidePanel__name}>
          <SkillRetrievalIcon />
          <span>Retrieval skill</span>
        </div>
        <p className={s.skillSidePanel__desc}>
          Some inormation about this annotator. So me inormation about this
          annotator. Some inormation about this annotator. Some inormation about
          this annotator. Some inormation about this annotator. Some inormation
          about this annotator. Some inormation about this annotator.
        </p>
        <Tabs className={s.tabs}>
          <TabList className={s.tabs__list}>
            <Tab className={s.tabs__tab}>Uses</Tab>
            <Tab className={s.tabs__tab} disabled>
              Used by
            </Tab>
          </TabList>
          <TabPanel className={s.tabs__panel}>
            <div className={s.skillSidePanel__accordions}>
              <Accordion title='Annotators' rounded>
                <div className={s['skillSidePanel__accordion-item']}>
                  <SkillScriptIcon />
                  DFF Program-Y Skill
                </div>
                <div className={s['skillSidePanel__accordion-item']}>
                  <SkillScriptIcon />
                  DFF Intent Responder Skill
                </div>
                <div className={s['skillSidePanel__accordion-item']}>
                  <FallbackIcon /> Dummy Skill
                </div>
              </Accordion>
            </div>
          </TabPanel>
        </Tabs>

        <div className={s.skillSidePanel__btns}>
          <Button theme='primary'>Add Skill</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default SkillSidePanel
