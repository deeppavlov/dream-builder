import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { Kebab } from '../../ui/Kebab/Kebab'
import { SmallTag } from '../SmallTag/SmallTag'
import { ReactComponent as PlusLogo } from '../../assets/icons/plus_icon.svg'
import s from './SkillListItem.module.scss'
import { SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'

interface SkillListItemProps extends SkillInfoInterface {
  checkbox?: boolean
  disabledMsg?: string
}

export const SkillListItem = ({
  name,
  author,
  authorImg,
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
  disabledMsg,
}: SkillListItemProps) => {
  let cx = classNames.bind(s)
  const skill = {
    name,
    author,
    authorImg,
    desc,
    dateCreated,
    version,
    ram,
    gpu,
    time,
    skillType,
    executionTime,
    botName,
  }

  const handleSkillListItemClick = () => {
    trigger(BASE_SP_EVENT, {
      children: <SkillSidePanel key={skill.name} skill={skill} />,
    })
  }

  const handleAddBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('CreateSkillModal', skill)
  }

  return (
    <tr className={s.tr} onClick={handleSkillListItemClick}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <Checkbox />
        </td>
      )}
      <td className={s.td}>
        <div className={s.name}>
          <p className={s.skillName}>{name || 'Name of The Skill'}</p>
          <span className={s.params}>
            {`RAM ${ram} | GPU ${gpu} | DS ${executionTime}s`}
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
          <div data-tip data-for='skill-add-interact'>
            <button
              className={s.area}
              onClick={handleAddBtnClick}
              disabled={disabledMsg !== undefined}>
              <PlusLogo />
            </button>
          </div>
        </div>
      </td>
      {disabledMsg && (
        <ReactTooltip
          place='bottom'
          effect='solid'
          className='tooltips'
          arrowColor='#8d96b5'
          delayShow={1000}
          id='skill-add-interact'>
          {disabledMsg}
        </ReactTooltip>
      )}
    </tr>
  )
}
