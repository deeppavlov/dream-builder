import classNames from 'classnames/bind'
import { ReactComponent as SkillFallbackIcon } from '../../assets/icons/fallbacks.svg'
import { ReactComponent as SkillScriptIcon } from '@assets/icons/skill_script.svg'
import { ReactComponent as SkillRetrievalIcon } from '@assets/icons/skill_retrieval.svg'
import { ReactComponent as ForkIcon } from '@assets/icons/fork.svg'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import { Accordion } from '../../ui/Accordion/Accordion'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import { useEffect, useState } from 'react'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { SkillInfoInterface } from '../../types/types'
import ReactTooltip from 'react-tooltip'
import useTabsManager from '../../hooks/useTabsManager'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { getStyleType } from '../../utils/getStyleType'
import { usePreview } from '../../context/PreviewProvider'
import s from './SkillSidePanel.module.scss'
import { componentTypeMap } from '../../Mapping/componentTypeMap'

interface Props {
  skill: SkillInfoInterface
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel = ({ skill: propSkill, activeTab, children }: Props) => {
  let cx = classNames.bind(s)
  const [skill, setSkill] = useState<SkillInfoInterface>(propSkill)
  const isEditor = children !== undefined
  const [properties, editor] = ['Properties', 'Editor']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: isEditor ? activeTab ?? properties : properties,
    tabList: new Map(
      isEditor
        ? [
            [properties, properties],
            [editor, editor],
          ]
        : [[properties, properties]]
    ),
  })
  const handleAddSkillBtnClick = () => trigger('CreateSkillModal', skill)
  const { isPreview } = usePreview()

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, name]) => (
            <li
              role='tab'
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              className={cx(isPreview && 'disabled')}
              onClick={() => !isPreview && tabsInfo.handleTabSelect(id)}>
              {name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      {tabsInfo.activeTabId === properties && (
        <div role='tabpanel' className={s.properties}>
          <div className={s.header}>
            <span className={s.name}>{skill.name}</span>
            <EditPencilIcon className={cx('edit-pencil')} data-disabled />
          </div>
          <div className={cx('author')}>
            <img src={skill.authorImg} alt='Author' />
            <span>{skill.author}</span>
          </div>
          <ul className={cx('table')}>
            <li className={cx('table-item')}>
              <span className={cx('table-name')}>Forked from:</span>
              <span className={cx('table-value')}>'--------'</span>
            </li>
            <li className={cx('table-item')}>
              <span className={cx('table-name')}>Type:</span>
              <span
                className={cx(
                  'table-value',
                  `${getStyleType(skill.skillType)}`
                )}>
                <img
                  className={s.typeLogo}
                  src={`./src/assets/icons/${
                    componentTypeMap[skill?.skillType]
                  }.svg`}
                />
                <span>{skill.skillType}</span>
              </span>
            </li>
          </ul>
          <p className={s.desc}>{skill.desc}</p>
          <div className={s.btns}>
            <div className={s.fork}>
              <Button theme='secondary'>
                <ForkIcon />
              </Button>
            </div>

            <div data-tip data-for='skill-add-interact'>
              <Button
                theme='secondary'
                props={{
                  // disabled: disabledMsg !== undefined,
                  disabled: isPreview,
                  onClick: handleAddSkillBtnClick,
                }}>
                Duplicate
              </Button>
            </div>
          </div>
          {/* {disabledMsg && (
          <ReactTooltip
            place='bottom'
            effect='solid'
            className='tooltips'
            arrowColor='#8d96b5'
            delayShow={1000}
            id='skill-add-interact'>
            {disabledMsg}
          </ReactTooltip>
        )} */}
        </div>
      )}
      {children && tabsInfo.activeTabId === editor && children}
    </>
  )
}

export default SkillSidePanel
