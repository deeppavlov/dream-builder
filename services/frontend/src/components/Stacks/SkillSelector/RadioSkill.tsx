import { useUIOptions } from 'context'
import { useId } from 'react'
import { IStackElement } from 'types/types'
import { capitalizeTitle } from 'utils/capitalizeTitle'
import { consts } from 'utils/consts'
import { Kebab, RadioButton } from 'components/Buttons'
import { RadioButtonProps } from 'components/Buttons/RadioButton/RadioButton'
import { SkillSelectorStackToolTip } from 'components/Menus'
import s from './RadioSkill.module.scss'

interface Props extends Omit<RadioButtonProps, 'children'> {
  skill: IStackElement
}

export const RadioSkill = ({
  skill,
  id,
  value,
  name,
  defaultChecked,
  htmlFor,
}: Props) => {
  const { UIOptions } = useUIOptions()
  const activeSkillId = UIOptions[consts.ACTIVE_SKILL_SP_ID]
  const cleanTitle = capitalizeTitle(skill.display_name)
  const tooltipId = useId()

  const handleClick = (e: React.MouseEvent) =>
    (e?.target as HTMLElement)?.blur()

  return (
    <div
      className={s.skill}
      data-active={activeSkillId === skill.name}
      onClick={handleClick}
    >
      <RadioButton
        id={id}
        value={value}
        name={name}
        defaultChecked={defaultChecked}
        htmlFor={htmlFor}
      >
        <div className={s.left}>
          <p className={s.name}>{cleanTitle}</p>
        </div>
        <div className={s.arrow}>
          <Kebab tooltipId={tooltipId} />
          <SkillSelectorStackToolTip tooltipId={tooltipId} skill={skill} />
        </div>
      </RadioButton>
    </div>
  )
}
