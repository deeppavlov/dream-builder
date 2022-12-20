import { ReactComponent as FallbackIcon } from '@assets/icons/fallbacks.svg'
import { ReactComponent as SkillScriptIcon } from '@assets/icons/skill_script.svg'
import { ReactComponent as BookIcon } from '@assets/icons/book.svg'
import { ReactComponent as AnnotatorNNBasedIcon } from '@assets/icons/annotator_nn_based.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './AnnotatorsSidePanel.module.scss'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs'

const AnnotatorsSidePanel = ({
  isOpen,
  setIsOpen,
  position,
}: SidePanelProps) => {
  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Properties'>
      <div className={s.annotatorsSidePanel}>
        <div className={s.annotatorsSidePanel__header}>
          <span className={s['annotatorSidePanel__header-title']}>
            Annotator:
          </span>
          <AnnotatorNNBasedIcon />
          <span>Intent Catcher</span>
        </div>
        <div className={s.annotatorsSidePanel__name}>
          <BookIcon />
          <span>Dictionary</span>
        </div>
        <p className={s.annotatorsSidePanel__desc}>
          Some inormation about this annotator. So me inormation about this
          annotator. Some inormation about this annotator. Some inormation about
          this annotator. Some inormation about this annotator. Some inormation
          about this annotator. Some inormation about this annotator.
        </p>
        <Tabs className={s.tabs}>
          <TabList className={s.tabs__list}>
            <Tab className={s.tabs__tab}>Uses</Tab>
            <Tab className={s.tabs__tab}>Used by</Tab>
          </TabList>
          <TabPanel className={s.tabs__panel}>
            <div className={s.annotatorsSidePanel__accordions}>
              <Accordion title='Annotators' rounded>
                <div className={s['annotatorsSidePanel__accordion-item']}>
                  <SkillScriptIcon />
                  DFF Program-Y Skill
                </div>
                <div className={s['annotatorsSidePanel__accordion-item']}>
                  <SkillScriptIcon />
                  DFF Intent Responder Skill
                </div>
                <div className={s['annotatorsSidePanel__accordion-item']}>
                  <FallbackIcon /> Dummy Skill
                </div>
              </Accordion>
              <Accordion title='Skills' rounded></Accordion>
            </div>
          </TabPanel>
          <TabPanel className={s.tabs__panel}></TabPanel>
        </Tabs>

        <div className={s.annotatorsSidePanel__btns}>
          <Button theme='primary'>Add Annotator</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default AnnotatorsSidePanel
