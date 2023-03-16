import { FC, useId } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { srcForIcons } from '../../utils/srcForIcons'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { trigger } from '../../utils/events'
import { ISkill } from '../../types/types'
import useTabsManager from '../../hooks/useTabsManager'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import Button from '../../ui/Button/Button'
import { usePreview } from '../../context/PreviewProvider'
import { componentTypeMap } from '../../mapping//componentTypeMap'
import { modelTypeMap } from '../../mapping//modelTypeMap'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import { useAuth } from '../../context/AuthProvider'
import s from './SkillSidePanel.module.scss'

interface Props {
  skill: ISkill
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel: FC<Props> = ({ skill, activeTab, children }) => {
  const [properties, editor] = ['Properties', 'Editor']
  const isEditor = children !== undefined
  const auth = useAuth()
  const { isPreview } = usePreview()
  let cx = classNames.bind(s)
  const tooltipId = useId()
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

  const handleAddSkillBtnClick = () => trigger('CreateSkillModal', skill)

  const nameForComponentType = componentTypeMap[skill?.component_type!]
  const nameForModelType = modelTypeMap[skill?.model_type!]
  const srcForComponentType = srcForIcons(nameForComponentType)
  const srcForModelType = srcForIcons(nameForModelType)
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
            <span className={s.name}>{skill?.display_name}</span>
            <EditPencilIcon className={s.icon} data-disabled />
          </div>
          <div className={s.author}>
            <Logo />
            <span>{skill?.author}</span>
          </div>
          <ul className={s.table}>
            <li className={s.item}>
              <span className={s.name}>Original author:</span>
              <span className={s.value}>{skill?.author}</span>
            </li>

            <li className={s.item}>
              <span className={cx('table-name')}>Component Type:</span>
              <span className={cx('value', nameForComponentType)}>
                <img className={s.logo} src={srcForComponentType} />
                <span>{skill?.component_type}</span>
              </span>
            </li>
            <li className={s.item}>
              <span className={cx('table-name')}>Model Type:</span>
              <span className={cx('value', nameForModelType)}>
                <img className={s.logo} src={srcForModelType} />
                <span>{skill?.model_type}</span>
              </span>
            </li>
            <br />
            <li className={s.item}>
              <span className={cx('table-name')}>Model:</span>
              <span className={s.value}>empty</span>
            </li>
          </ul>
          <p className={s.desc}>{skill?.description}</p>
          <div className={s.btns}>
            <div data-tip data-tooltip-id={'skillAddTo' + tooltipId}>
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
              id={'skillAddTo' + tooltipId}
              content='You need to clone the virtual assistant to edit'
            />
          )}
        </div>
      )}
      {children && tabsInfo.activeTabId === editor && children}
    </>
  )
}

export default SkillSidePanel
