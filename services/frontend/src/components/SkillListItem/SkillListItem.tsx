import classNames from 'classnames/bind'
import { FC, useId } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as Add } from '../../assets/icons/add.svg'
import { ReactComponent as Edit } from '../../assets/icons/edit_pencil.svg'
import { useDisplay } from '../../context/DisplayContext'
import { usePreview } from '../../context/PreviewProvider'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import { RoutesList } from '../../router/RoutesList'
import {
  ICreateComponent,
  ISkill,
  SkillAvailabilityType,
} from '../../types/types'
import Button from '../../ui/Button/Button'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { dateToUTC } from '../../utils/dateToUTC'
import { timeToUTC } from '../../utils/timeToUTC'
import triggerSkillSidePanel from '../../utils/triggerSkillSidePanel'
import SkillCardToolTip from '../SkillCardToolTip/SkillCardToolTip'
import SvgIcon from '../SvgIcon/SvgIcon'
import s from './SkillListItem.module.scss'

interface SkillListItemProps {
  skill: ISkill
  type: SkillAvailabilityType
  forModal?: boolean
  withoutDate?: boolean
  handleAdd?: (skill: ICreateComponent) => void
}

export const SkillListItem: FC<SkillListItemProps> = ({
  skill,
  forModal,
  type,
  withoutDate,
  handleAdd,
}) => {
  const date = dateToUTC(skill?.date_created)
  const time = timeToUTC(new Date(skill?.date_created))
  // const [disabled, setDisabled] = useState<boolean>(false)
  const tooltipId = useId()
  const { isPreview } = usePreview()
  const { name: distRoutingName } = useParams()
  const { options } = useDisplay()
  const { name: distName } = useParams()
  const nav = useNavigate()
  const activeSKillId = options.get(consts.ACTIVE_SKILL_SP_ID)
  const isActive = skill.id === activeSKillId
  const nameForComponentType = componentTypeMap[skill?.component_type!]
  let cx = classNames.bind(s)

  const handleSkillListItemClick = (e: React.MouseEvent) => {
    triggerSkillSidePanel({
      skill,
      visibility: type,
      activeTab: 'Properties',
      isOpen: !isActive,
      distName: distName || '',
    })
  }
  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    const { display_name, description, prompt, lm_service } = skill

    handleAdd &&
      handleAdd({
        display_name,
        description,
        prompt,
        lm_service_id: lm_service?.id,
      })
  }
  const handleEditClick = (e: React.MouseEvent) => {
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
      activeTab: 'Editor',
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
          <p className={s.skillName}>{skill?.display_name || '------'}</p>
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
              {skill?.component_type || '------'}
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
          {skill?.description}
          {/* <BaseToolTip
            delayShow={TOOLTIP_DELAY}
            id={'skillTableDesc' + tooltipId}
            content={skill?.description}
            theme='description'
          /> */}
        </div>
      </td>
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
                props={{ onClick: handleAddClick }}
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
              <Kebab tooltipId={'ctxMenu' + tooltipId} theme='card' />
            </>
          )}
          <SkillCardToolTip
            skill={skill}
            tooltipId={'ctxMenu' + tooltipId}
            isPreview={isPreview}
          />
        </div>
      </td>
    </tr>
  )
}
