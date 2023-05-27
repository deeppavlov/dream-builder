import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { useParams } from 'react-router'
import { usePreview } from '../../context/PreviewProvider'
import { useUIOptions } from '../../context/UIOptionsContext'
import useTabsManager, { TabList } from '../../hooks/useTabsManager'
import { ISkill, SkillAvailabilityType } from '../../types/types'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import EditPencilButton from '../EditPencilButton/EditPencilButton'
import SkillTaskPlaceholder from '../SkillTaskPlaceholder/SkillTaskPlaceholder'
import s from './DumbSkillSP.module.scss'

interface Props {
  skill: ISkill
  activeTab?: 'Properties' | 'Editor'
  tabs?: TabList
  visibility?: SkillAvailabilityType
  children?: React.ReactNode // Editor Tab element
}

const DumbSkillSP = ({
  skill,
  activeTab,
  tabs,
  visibility,
  children,
}: Props) => {
  const [properties, editor] = ['Properties', 'Editor']
  const isEditor = children !== undefined
  const { isPreview } = usePreview()
  const { setUIOption } = useUIOptions()
  const isCustomizable =
    skill?.is_customizable && !isPreview && visibility !== 'public'
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: isEditor ? activeTab ?? properties : properties,
    tabList:
      tabs ??
      new Map(
        isEditor
          ? [
              [properties, { name: properties }],
              [editor, { name: editor, disabled: isPreview }],
            ]
          : [[properties, { name: properties }]]
      ),
  })
  const { name: distName } = useParams()

  let cx = classNames.bind(s)

  const handleRenameBtnClick = () =>
    trigger('SkillModal', { action: 'edit', skill })

  const dispatchTrigger = (isOpen: boolean) =>
    setUIOption({
      name: consts.ACTIVE_SKILL_SP_ID,
      value: isOpen ? skill?.id : null,
    })

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

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
              onClick={() => !isPreview && tabsInfo.handleTabSelect(id)}
            >
              {tab.name}
            </li>
          ))}
        </ul>
      </SidePanelHeader>
      {tabsInfo.activeTabId === properties && (
        <div role='tabpanel' className={s.properties}>
          <div className={s.header}>
            <span className={s.name}>{skill?.display_name}</span>
            <EditPencilButton
              disabled={!isCustomizable}
              onClick={handleRenameBtnClick}
            />
          </div>
          <div className={s.author}>
            <img src={skill?.author?.picture} />
            <span>
              {skill?.author.fullname == 'Deepy Pavlova'
                ? 'Dream Builder Team'
                : skill?.author.fullname}
            </span>
          </div>
          <ul className={s.table}>
            <li className={s.item}>
              {skill?.author?.fullname && (
                <>
                  <span className={cx('table-name')}>Original author:</span>
                  <span className={s.value}>
                    {skill?.author.fullname == 'Deepy Pavlova'
                      ? 'Dream Builder Team'
                      : skill?.author.fullname}
                  </span>
                </>
              )}
            </li>
            {skill?.lm_service?.display_name && (
              <li className={s.item}>
                <span className={cx('table-name')}>Model:</span>
                <span className={s.value}>
                  {skill?.lm_service?.display_name!}
                </span>
              </li>
            )}
          </ul>
          <li className={cx('item', 'big-item')}>
            <span className={cx('table-name')}>Description:</span>
            <p className={s.value}>{skill?.description}</p>
          </li>
          <li className={cx('item', 'big-item')}>
            <SkillTaskPlaceholder
              skill={skill}
              value={skill?.description}
              distName={distName || ''}
              activeTab={tabsInfo.activeTabId as any}
              visibility={visibility}
            />
          </li>
        </div>
      )}
      {children && tabsInfo.activeTabId === editor && children}
    </>
  )
}

export default DumbSkillSP
