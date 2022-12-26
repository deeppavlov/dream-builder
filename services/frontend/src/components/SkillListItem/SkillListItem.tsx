import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import { Kebab } from '../../ui/Kebab/Kebab'
import { SmallTag } from '../SmallTag/SmallTag'
import { ReactComponent as PlusLogo } from '../../assets/icons/plus_icon.svg'
import s from './SkillListItem.module.scss'
import { SkillInfoInterface } from '../../types/types'

interface SkillListItemProps extends SkillInfoInterface {
  checkbox?: boolean
}

export const SkillListItem = ({
  name,
  author,
  desc,
  dateCreated,
  version,
  ram,
  gpu,
  time,
  skillType,
  checkbox,
  executionTime,
  botName,
}: SkillListItemProps) => {
  let cx = classNames.bind(s)
  return (
    <tr className={s.tr}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <CheckBox />
        </td>
      )}
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.skillName}>{name || 'Name of The Skill'}</p>
          <span className={s.params}>
            {'RAM ' + ram || '60.0GB'} | {'GPU ' + gpu || '65.0 GB'} |{' '}
            {'DS ' + executionTime + 's' || '0.0s'}
          </span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.type}>
          <img
            className={s.typeLogo}
            src={`./src/assets/icons/${skillType}.svg`}
          />
          <p className={cx('typeText', skillType)}>
            {skillType || 'Type of Skill'}
          </p>
        </div>
      </td>
      <td className={s.td}>
        <div
          className={s.description}
          data-for='descriptionTooltip'
          data-tip={desc}>
          <ReactTooltip
            id='descriptionTooltip'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
          {desc || 'Lorem  '}
        </div>
      </td>
      <td className={s.td}>
        <div className={s.version}>
          <SmallTag theme='version'>{'v' + version ?? 'v.0.01'}</SmallTag>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated}</p>
          <p className={s.time}>{time} </p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <button className={s.area}>
            <PlusLogo />
          </button>
        </div>
      </td>
    </tr>
  )
}
