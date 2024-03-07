import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC, useId } from 'react'
import { useTranslation } from 'react-i18next'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as Add } from 'assets/icons/add.svg'
import { ReactComponent as Edit } from 'assets/icons/edit_pencil.svg'
import { RoutesList } from 'router/RoutesList'
import { ISkill, SkillAvailabilityType, TLocale } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { componentTypeMap } from 'mapping/componentTypeMap'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import { consts } from 'utils/consts'
import { dateToUTC } from 'utils/dateToUTC'
import { timeToUTC } from 'utils/timeToUTC'
import triggerSkillSidePanel from 'utils/triggerSkillSidePanel'
import { Button, Kebab } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { SkillCardToolTip, StatusToolTip } from 'components/Menus'
import s from './SkillListItem.module.scss'

interface SkillListItemProps {
  skill: ISkill
  type: SkillAvailabilityType
  forModal?: boolean
  withoutDate?: boolean
  handleAdd?: (skill: ISkill) => void
}

export const SkillListItem: FC<SkillListItemProps> = ({
  skill,
  forModal,
  type,
  withoutDate,
  handleAdd,
}) => {
  const { t, i18n } = useTranslation()
  const date = dateToUTC(skill?.date_created, i18n.language as TLocale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  const time = timeToUTC(
    new Date(skill?.date_created),
    i18n.language as TLocale
  )
  // const [disabled, setDisabled] = useState<boolean>(false)
  const tooltipId = useId()
  const { isPreview } = usePreview()
  const { name: distRoutingName } = useParams()
  const { UIOptions } = useUIOptions()
  const { name: distName } = useParams()
  const nav = useNavigate()
  const { skillsPropsOpened, skillEditorOpened } = useGaSkills()
  const activeSKillId = UIOptions[consts.ACTIVE_SKILL_SP_ID]
  const nameForComponentType = componentTypeMap[skill?.component_type!]
  let cx = classNames.bind(s)
  const isActive = skill.id === activeSKillId
  const isDummy = skill.name === 'dummy_skill'

  const handleSkillListItemClick = (e: React.MouseEvent) => {
    if (
      document
        .querySelector(`[data-tooltip-id="${tooltipId}"]`)
        ?.contains(e.target as Node)
    ) {
      return
    }
    !isActive && skillsPropsOpened('card_click', skill)

    triggerSkillSidePanel({
      skill,
      visibility: type,
      activeTab: 'properties',
      isOpen: !isActive,
      distName: distName || '',
    })
  }
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    handleAdd && handleAdd(skill)
  }
  const handleEditClick = (e: React.MouseEvent) => {
    skillEditorOpened('skill_block', skill)
    if (skill.component_type === ('Generative' as any)) {
      // trigger('SkillPromptModal', { skill })
      // trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
      nav(
        generatePath(RoutesList.editor.skillEditor, {
          name: distRoutingName as string,
          skillId: skill.component_id,
        } as any)
      )
      e.stopPropagation()
      return
    }

    triggerSkillSidePanel({
      skill,
      visibility: type,
      activeTab: 'details',
      distName: distName || '',
    })
    e.stopPropagation()
  }
  // const handleAddBtnClick = (e: React.MouseEvent) => {
  //   e.stopPropagation()
  //   trigger('SkillModal', {
  //     action: 'create',
  //     parent: skill,
  //   })
  // }

  return (
    <tr
      className={s.tr}
      onClick={handleSkillListItemClick}
      data-active={skill.id === activeSKillId}
    >
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.skillName}>
            {isDummy ? t('cards.skill.dummy') : skill?.display_name || '------'}
          </p>
        </div>
      </td>
      <td className={s.td}>
        {skill?.component_type && (
          <div className={s.type}>
            <SvgIcon
              iconName={nameForComponentType}
              svgProp={{ className: s.typeLogo }}
            />
            <p className={cx('typeText', nameForComponentType)}>
              {isDummy
                ? t('cards.skill.fallback')
                : t('cards.skill.generative')}
            </p>
          </div>
        )}
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-tip
          data-tooltip-id={'skillTableDesc' + tooltipId}
        >
          {isDummy ? t('cards.skill.dummyDescription') : skill?.description}
          {/* <BaseToolTip
            delayShow={TOOLTIP_DELAY}
            id={'skillTableDesc' + tooltipId}
            content={skill?.description}
            theme='description'
          /> */}
        </div>
      </td>

      {type === 'your' && (
        <td className={s.td}>
          <div className={s.listError}>
            <StatusToolTip name='skill' skill={skill} />
          </div>
        </td>
      )}

      {!withoutDate && (
        <td className={s.td}>
          <div className={s.date}>
            <p className={s.ddmmyyyy}>{date || 'Empty'}</p>
            <p className={s.time}>{time || 'Empty'}</p>
          </div>
        </td>
      )}
      <td className={s.td}>
        <div className={s.btns_area}>
          {forModal ? (
            <>
              <Button
                theme='primary'
                small
                withIcon
                props={{
                  onClick: handleAddClick,
                  style: {
                    height: '48px',
                    width: '48px',
                    borderRadius: '12px',
                  },
                }}
              >
                <Add />
              </Button>
              {/* <Button
                theme='secondary'
                small
                withIcon
                props={{ onClick: handleSkillListItemClick }}
              >
                <Properties />
              </Button> */}
            </>
          ) : (
            <>
              {/* <ToggleButton handleToggle={handleToggle} disabled={isPreview} /> */}
              {!isPreview && (
                <Button
                  theme='primary'
                  small
                  withIcon
                  props={{
                    disabled: !skill?.is_customizable,
                    onClick: handleEditClick,
                  }}
                >
                  <Edit />
                </Button>
              )}
              <Kebab tooltipId={tooltipId} theme='card' />
            </>
          )}
          <SkillCardToolTip
            skill={skill}
            tooltipId={tooltipId}
            isPreview={isPreview}
          />
        </div>
      </td>
    </tr>
  )
}
