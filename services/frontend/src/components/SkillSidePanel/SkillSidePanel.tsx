import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { srcForIcons } from '../../utils/srcForIcons'
import { trigger } from '../../utils/events'
import { SkillInfoInterface } from '../../types/types'
import useTabsManager from '../../hooks/useTabsManager'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import Button from '../../ui/Button/Button'
import { usePreview } from '../../context/PreviewProvider'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import { modelTypeMap } from '../../mapping/modelTypeMap'
import s from './SkillSidePanel.module.scss'

interface Props {
  skill: SkillInfoInterface
  activeTab?: 'Properties' | 'Editor'
  children?: React.ReactNode // Editor Tab element
}

const SkillSidePanel: FC<Props> = ({
  skill: propSkill,
  activeTab,
  children,
}) => {
  let cx = classNames.bind(s)
  const [skill, setSkill] = useState<SkillInfoInterface>(propSkill)
  const isEditor = children !== undefined
  const [properties, editor] = ['Properties', 'Editor']
  const { isPreview } = usePreview()
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
  const { name, authorImg, botName, author, componentType, modelType, desc } =
    skill
  const nameForComponentType = componentTypeMap[componentType]
  const nameForModelType = modelTypeMap[modelType]
  const srcForComponentType = srcForIcons(nameForComponentType)
  const srcForModelType = srcForIcons(nameForModelType)
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
            <span className={s.name}>{name}</span>
            <EditPencilIcon className={s.icon} data-disabled />
          </div>
          <div className={s.author}>
            <img src={authorImg} alt='Author' />
            <span>{author}</span>
          </div>
          <ul className={s.table}>
            <li className={s.item}>
              <span className={s.name}>Original author:</span>
              <span className={s.value}>{botName}</span>
            </li>

            <li className={s.item}>
              <span className={s.name}>Component Type:</span>
              <span className={cx('value', nameForComponentType)}>
                <img className={s.logo} src={srcForComponentType} />
                <span>{componentType}</span>
              </span>
            </li>
            <li className={s.item}>
              <span className={s.name}>Model Type:</span>
              <span className={cx('value', nameForModelType)}>
                <img className={s.logo} src={srcForModelType} />
                <span>{modelType}</span>
              </span>
            </li>
            <br />
            <li className={s.item}>
              <span className={s.name}>Model:</span>
              <span className={s.value}>empty</span>
            </li>
          </ul>
          <p className={s.desc}>{desc}</p>
          <div className={s.btns}>
            <div data-tip data-for='skill-add-interact'>
              <Button
                theme='secondary'
                props={{
                  disabled: isPreview,
                  onClick: handleAddSkillBtnClick,
                }}>
                Duplicate
              </Button>
            </div>
          </div>
        </div>
      )}
      {children && tabsInfo.activeTabId === editor && children}
    </>
  )
}

export default SkillSidePanel
