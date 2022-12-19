import { ReactComponent as Logo } from '../../assets/icons/generative.svg'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { Kebab } from '../../ui/Kebab/Kebab'
import { SkillCardProps } from '../SkillCard/SkilllCard'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './SkillListItem.module.scss'

interface SkillListItemProps extends SkillCardProps {}

export const SkillListItem = ({
  skillName,
  companyName,
  description,
  date,
  version,
  ram,
  gpu,
  time,
  skillType,
  checkbox,
  executionTime,
}: SkillListItemProps) => {
  return (
    <tr className={s.tr}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <CheckBox />
        </td>
      )}
      <td className={s.td}>
        <div className={s.name}>
          <p>{skillName || 'Name of The Skill'}</p>
          <span className={s.params}>
            {'RAM ' + ram || '60.0GB'} | {'GPU ' + gpu || '65.0 GB'} |{' '}
            {'DS ' + executionTime + 's' || '0.0s'}
          </span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>
          <Logo />
          <p>{skillType || 'Skill Type'}</p>
        </div>
      </td>
      <td className={s.td}>
        <p className={s.description}>{description || 'Lorem  '}</p>
      </td>
      <td className={s.td}>
        <div className={s.version}>
          <SmallTag theme='version'>{'v' + version || 'v.0.01'}</SmallTag>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{date}</p>
          <p className={s.time}>{time} </p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <div>
            {/* <Kebab type='row' color='#8D96B5' dataFor='skills' /> */}
          </div>
        </div>
      </td>
    </tr>
  )
}
