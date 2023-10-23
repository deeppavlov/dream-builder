import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import i18next from 'i18next'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import logo from 'assets/icons/logo.png'
import { ISkill, SkillAvailabilityType } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import useTabsManager, { TabList } from 'hooks/useTabsManager'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { EditPencilButton } from 'components/Buttons'
import { Accordion } from 'components/Dropdowns'
import SidePanelHeader from 'components/Panels/SidePanelHeader/SidePanelHeader'
import s from './DumbSkillSP.module.scss'

interface Props {
  skill: ISkill
  activeTab?: 'properties' | 'details'
  tabs?: TabList
  visibility?: SkillAvailabilityType
  children?: React.ReactNode // Editor Tab element
}

const DumbSkillSP: FC<Props> = ({
  skill,
  activeTab,
  tabs,
  visibility,
  children,
}) => {
  const { t } = useTranslation()
  const [properties, details] = ['properties', 'details']
  const { isPreview } = usePreview()
  const { setUIOption } = useUIOptions()
  const isCustomizable =
    skill?.is_customizable && !isPreview && visibility !== 'public'
  const tabList =
    tabs ?? new Map([[properties, { name: t('tabs.properties') }]])
  const [tabsInfo, setTabsInfo] = useTabsManager({
    activeTabId: activeTab ?? properties,
    tabList,
  })
  let cx = classNames.bind(s)
  const { editSkillButtonClick, skillDetailsOpened } = useGaSkills()

  const isDeepyPavlova =
    import.meta.env.VITE_SUB_FOR_DEFAULT_TEMPLATES === skill?.author?.outer_id

  const handleRenameBtnClick = () => {
    editSkillButtonClick('sidepanel_button', skill)
    trigger('SkillModal', { action: 'edit', skill })
  }

  const dispatchTrigger = (isOpen: boolean) =>
    setUIOption({
      name: consts.ACTIVE_SKILL_SP_ID,
      value: isOpen ? skill?.id : null,
    })

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [])

  useEffect(() => {
    setTabsInfo({ activeTabId: tabsInfo.activeTabId, tabList })
  }, [i18next.language])

  return (
    <div id='skill_sp' className={s.dumbSkillSP}>
      <SidePanelHeader>
        <ul role='tablist'>
          {Array.from(tabsInfo.tabs).map(([id, tab]) => (
            <li
              role='tab'
              data-disabled={tab.disabled}
              key={id}
              aria-selected={tabsInfo.activeTabId === id}
              onClick={() => {
                !isPreview && tabsInfo.handleTabSelect(id)
                !isPreview && skillDetailsOpened('skill_sidepanel', skill)
              }}
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
            <img src={isDeepyPavlova ? logo : skill?.author?.picture} />
            <span>
              {isDeepyPavlova ? 'Dream Builder Team' : skill?.author.name}
            </span>
          </div>
          <ul className={s.table}>
            <li className={s.item}>
              {skill?.author?.name && (
                <>
                  <span className={cx('table-name')}>
                    {t('sidepanels.skill_properties.original_author')}
                  </span>
                  <span className={s.value}>
                    {isDeepyPavlova ? 'Dream Builder Team' : skill?.author.name}
                  </span>
                </>
              )}
            </li>
            {skill?.lm_service?.display_name && (
              <li className={s.item}>
                <span className={cx('table-name')}>
                  {t('sidepanels.skill_properties.model')}
                </span>
                <span className={s.value}>
                  {skill?.lm_service?.display_name!}
                </span>
              </li>
            )}
          </ul>
          {skill?.lm_service?.description && (
            <li className={cx('item', 'big-item')}>
              <Accordion
                title={t(
                  'sidepanels.skill_properties.accordions.model_details'
                )}
                rounded
                isActive
              >
                <p className={cx('value', 'accardion-value')}>
                  {skill?.lm_service?.description}
                </p>
              </Accordion>
            </li>
          )}
          <li className={cx('item', 'big-item')}>
            <Accordion title={t('accordions.desc')} rounded isActive>
              <p className={cx('value', 'accardion-value')}>
                {skill?.description}
              </p>
            </Accordion>
          </li>
          {/* <li className={cx('item', 'big-item')}>
            <SkillTaskPlaceholder
              skill={skill}
              value={skill?.description}
              distName={distName || ''}
              activeTab={tabsInfo.activeTabId as any}
              visibility={visibility}
            />
          </li> */}
        </div>
      )}
      {children && tabsInfo.activeTabId === details && children}
    </div>
  )
}

export default DumbSkillSP
