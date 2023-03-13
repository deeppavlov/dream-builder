import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import DeepPavlovLogo from '@assets/icons/deeppavlov_logo_round.svg'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { srcForIcons } from '../../utils/srcForIcons'
import { trigger } from '../../utils/events'
import { ISkill } from '../../types/types'
import useTabsManager from '../../hooks/useTabsManager'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import Button from '../../ui/Button/Button'
import { usePreview } from '../../Context/PreviewProvider'
import { componentTypeMap } from '../../Mapping/componentTypeMap'
import { modelTypeMap } from '../../Mapping/modelTypeMap'
import s from './SkillSidePanel.module.scss'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { useAuth } from '../../Context/AuthProvider'

interface Props {
  skill: ISkill
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel = ({ skill, activeTab, children }: Props) => {
  const {
    component_type,
    model_type,
    display_name,
    author,
    description,
    name,
  } = skill
  const auth = useAuth()
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
  const nameForComponentType = componentTypeMap[component_type ?? '']
  const nameForModelType = modelTypeMap[model_type ?? '']
  const srcForComponentType = srcForIcons(nameForComponentType)
  const srcForModelType = srcForIcons(nameForModelType)
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
          <div className={s.header}>
            <span className={s.name}>{display_name}</span>
            <EditPencilIcon className={s.icon} data-disabled />
          </div>
          <div className={s.author}>
            <img src={DeepPavlovLogo} alt='Author' />
            <span>{author}</span>
          </div>
          <ul className={s.table}>
            <li className={s.item}>
              <span className={cx('table-name')}>Original author:</span>
              <span className={s.value}>empty</span>
            </li>

            <li className={s.item}>
              <span className={cx('table-name')}>Component Type:</span>
              <span className={cx('value', nameForComponentType)}>
                <img className={s.logo} src={srcForComponentType} />
                <span>{component_type}</span>
              </span>
            </li>
            <li className={s.item}>
              <span className={cx('table-name')}>Model Type:</span>
              <span className={cx('value', nameForModelType)}>
                <img className={s.logo} src={srcForModelType} />
                <span>{model_type}</span>
              </span>
            </li>
            <br />
            <li className={s.item}>
              <span className={cx('table-name')}>Model:</span>
              <span className={s.value}>empty</span>
            </li>
          </ul>
          <p className={s.desc}>{skill.description}</p>
          <div className={s.btns}>
            <div data-tip data-tooltip-id={'skillAddTo' + name}>
              <Button
                theme='primary'
                props={{
                  disabled: isPreview,
                  onClick: handleAddSkillBtnClick,
                }}>
                Add to ...
              </Button>
            </div>
          </div>

          {(isPreview || !auth?.user) && (
            <BaseToolTip
              id={'skillAddTo' + name}
              content='You must be signed in to add the skill'
            />
          )}
        </div>
      )}
      {children && tabsInfo.activeTabId === editor && children}
    </>
  )
}

export default SkillSidePanel
