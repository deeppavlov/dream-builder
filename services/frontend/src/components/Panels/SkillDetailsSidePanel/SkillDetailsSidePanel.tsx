import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { SkillAvailabilityType } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { useComponent } from 'hooks/api'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { SidePanelButtons, SidePanelName } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import DumbSkillSP from 'components/Panels/SkillSidePanel/DumbSkillSP'
import s from './SkillDetailsSidePanel.module.scss'

interface Props {
  component_id: number
  distName: string
  activeTab?: 'properties' | 'details'
  visibility?: SkillAvailabilityType
}

const SkillDetailsSidePanel = ({
  component_id,
  distName,
  activeTab,
  visibility,
}: Props) => {
  const { t } = useTranslation()
  const { getComponent } = useComponent()
  const { data: skill } = getComponent({
    id: component_id,
    distName,
    type: 'skills',
  })

  const { name } = useParams()
  const nav = useNavigate()
  const { isPreview } = usePreview()
  const { skillEditorOpened } = useGaSkills()
  const { setTokenState } = useGaToken()
  const isCustomizable =
    skill?.is_customizable && !isPreview && visibility !== 'public'
  const tabs = new Map([
    ['properties', { name: t('tabs.properties') }],
    ['details', { name: t('tabs.details'), disabled: !isCustomizable }],
  ])
  let cx = classNames.bind(s)

  const handleEnterTokenClick = () => {
    setTokenState('skill_sidepanel', skill.lm_service?.api_key?.display_name)
    trigger('AccessTokensModal', {})
  }

  const triggerEditModal = () => {
    skillEditorOpened('sidepanel_details_edit', skill)
    const isDistName = name !== undefined && name.length > 0

    if (isDistName) {
      nav(
        generatePath(RoutesList.editor.skillEditor, {
          name,
          skillId: skill?.component_id,
        })
      )
    }
  }

  // Close SidePanel if the skill was deleted
  useEffect(() => {
    if (!skill) trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }, [skill])

  return (
    <DumbSkillSP
      skill={skill}
      tabs={tabs}
      activeTab={activeTab}
      visibility={visibility}
    >
      <div className={s.skillDetailsSidePanel}>
        <SidePanelName>{skill?.display_name}</SidePanelName>
        <ul className={s.table}>
          <li className={s.item}>
            <span className={cx('table-name')}>
              {t('sidepanels.skill_details.generative_model')}
            </span>
            <span className={s.value}>
              {skill?.lm_service?.display_name || 'Empty'}
            </span>
          </li>
          <li className={cx('item', 'link')}>
            <Button theme='ghost' props={{ onClick: handleEnterTokenClick }}>
              {t('api_key.required.link')}
            </Button>
          </li>
          <li className={cx('item', 'big-item')}>
            <span className={cx('table-name')}>
              {t('sidepanels.skill_details.prompt')}
            </span>
            <p className={cx('value', 'prompt')}>{skill?.prompt || 'Empty'}</p>
          </li>
        </ul>
        <SidePanelButtons>
          <Button
            theme='primary'
            props={{ onClick: isCustomizable && triggerEditModal }}
          >
            {t('sidepanels.skill_details.btns.edit')}
          </Button>
        </SidePanelButtons>
      </div>
    </DumbSkillSP>
  )
}

export default SkillDetailsSidePanel
