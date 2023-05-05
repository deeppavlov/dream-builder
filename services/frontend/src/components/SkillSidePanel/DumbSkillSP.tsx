import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import classNames from 'classnames/bind'
import { useEffect } from 'react'
import Woman from '../../assets/icons/woman.png'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import useTabsManager, { TabList } from '../../hooks/useTabsManager'
import { ISkill } from '../../types/types'
import SidePanelHeader from '../../ui/SidePanelHeader/SidePanelHeader'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import s from './DumbSkillSP.module.scss'

interface Props {
  skill: ISkill
  activeTab?: 'Properties' | 'Editor'
  tabs?: TabList
  children?: React.ReactNode // Editor Tab element
}

const DumbSkillSP = ({ skill, activeTab, tabs, children }: Props) => {
  const [properties, editor] = ['Properties', 'Editor']
  const isEditor = children !== undefined
  const { isPreview } = usePreview()
  const { dispatch } = useDisplay()
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
  // const nameForComponentType = componentTypeMap[skill?.component_type!]
  // const nameForModelType = modelTypeMap[skill?.model_type!]
  // const srcForComponentType = srcForIcons(nameForComponentType)
  // const srcForModelType = srcForIcons(nameForModelType)
  let cx = classNames.bind(s)

  const handleAddSkillBtnClick = () => trigger('CreateSkillModal', skill)

  const handleRenameBtnClick = () =>
    trigger('SkillModal', { action: 'edit', skill })

  const dispatchTrigger = (isOpen: boolean) =>
    dispatch({
      type: 'set',
      option: {
        id: consts.ACTIVE_SKILL_SP_ID,
        value: isOpen ? skill.id : null,
      },
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
            <button
              disabled={!skill?.is_customizable || isPreview}
              onClick={handleRenameBtnClick}
              className={s['rename-btn']}
            >
              <EditPencilIcon className={s.icon} />
            </button>
          </div>
          <div className={s.author}>
            {skill?.author.fullname == 'DeepPavlov' ? (
              <img src={Woman} alt='Author' />
            ) : (
              <img src={skill?.author?.picture} />
            )}
            <span>
              {' '}
              {skill?.author.fullname == 'DeepPavlov'
                ? 'Dr. Xandra Smith'
                : skill?.author.fullname}
            </span>
          </div>
          <ul className={s.table}>
            <li className={s.item}>
              <span className={cx('table-name')}>Original author:</span>
              <span className={s.value}>{skill?.author?.fullname}</span>
            </li>

            {/* {skill?.component_type && (
              <li className={s.item}>
                <span className={cx('table-name')}>Component Type:</span>
                <span className={cx('value', nameForComponentType)}>
                  <img className={s.logo} src={srcForComponentType} />
                  <span>{skill?.component_type}</span>
                </span>
              </li>
            )}
            <li className={s.item}>
              <span className={cx('table-name')}>Model Type:</span>
              <span className={cx('value', nameForModelType)}>
                <img className={s.logo} src={srcForModelType} />
                <span className={cx(nameForModelType)}>
                  {skill?.model_type}
                </span>
              </span>
            </li> */}
            <br />
            <li className={s.item}>
              {skill?.lm_service?.display_name && (
                <>
                  <span className={cx('table-name')}>Model:</span>
                  <span className={s.value}>
                    {skill?.lm_service?.display_name!}
                  </span>
                </>
              )}
            </li>
          </ul>
          <p className={s.desc}>{skill?.description}</p>
          {/* <div className={s.btns}>
            <div data-tip data-tooltip-id={'skillAddTo' + tooltipId}>
              <Button
                theme='primary'
                props={{
                  disabled: isPreview,
                  onClick: handleAddSkillBtnClick,
                }}
              >
                Add to ...
              </Button>
            </div>
          </div>

          {(isPreview || !auth?.user) && (
            <BaseToolTip
              delayShow={TOOLTIP_DELAY}
              id={'skillAddTo' + tooltipId}
              content='You need to clone the virtual assistant to edit'
            />
          )} */}
        </div>
      )}
      {children && tabsInfo.activeTabId === editor && children}
    </>
  )
}

export default DumbSkillSP