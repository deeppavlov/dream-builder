import { useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { trigger } from '../../utils/events'
import { SkillInfoInterface } from '../../types/types'
import useTabsManager from '../../hooks/useTabsManager'
import { usePreview } from '../../context/PreviewProvider'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import Button from '../../ui/Button/Button'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import s from './SkillSidePanel.module.scss'

interface Props {
  skill: SkillInfoInterface
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel = ({ skill: propSkill, activeTab, children }: Props) => {
  const [skill, setSkill] = useState<SkillInfoInterface>(propSkill)
  const isEditor = children !== undefined
  const { isPreview } = usePreview()
  const [properties, editor] = ['Properties', 'Editor']
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: isEditor ? activeTab ?? properties : properties,
    tabList: new Map(
      isEditor
        ? [
            [properties, { name: properties }],
            [editor, { name: editor, disabled: isPreview }],
          ]
        : [[properties, { name: properties }]]
    ),
  })
  let cx = classNames.bind(s)

  const handleAddSkillBtnClick = () => trigger('CreateSkillModal', skill)

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, tab]) => (
            <li
              role='tab'
              data-disabled={tab.disabled}
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              onClick={() => !isPreview && tabsInfo.handleTabSelect(id)}>
              {tab.name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      {tabsInfo.activeTabId === properties && (
        <div role='tabpanel' className={s.properties}>
          <SidePanelName>
            <span>{skill.name}</span>
            <EditPencilIcon className={cx('edit-pencil')} data-disabled />
          </SidePanelName>

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
              <span className={cx('table-value', `${skill.skillType}`)}>
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
          <SidePanelButtons>
            <Button theme='secondary'>Duplicate</Button>
            <div data-tip data-for='skill-add-interact'>
              <Button
                theme='primary'
                props={{
                  // disabled: disabledMsg !== undefined,
                  onClick: handleAddSkillBtnClick,
                }}>
                Add to ...
              </Button>
            </div>
          </SidePanelButtons>
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
