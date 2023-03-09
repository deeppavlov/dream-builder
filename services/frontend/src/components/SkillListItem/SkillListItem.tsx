import { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import { Checkbox } from '../../ui/Checkbox/Checkbox'
import { Kebab } from '../../ui/Kebab/Kebab'
import { SkillInfoInterface } from '../../types/types'
import { trigger } from '../../utils/events'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import { componentTypeMap } from '../../mapping/componentTypeMap'
import { srcForIcons } from '../../utils/srcForIcons'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './SkillListItem.module.scss'

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
  modelType,
  componentType,
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
    modelType,
    componentType,
    executionTime,
    botName,
  }
  const [disabled, setDisabled] = useState<boolean>(false)

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    setDisabled(disabled => !disabled)
  }
  const handleSkillListItemClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    trigger(BASE_SP_EVENT, {
      children: <SkillSidePanel key={skill.name} skill={skill} />,
    })
  }

  const handleAddBtnClick = (e: any) => {
    e.stopPropagation()
    trigger('SkillModal', {
      action: 'create',
      parent: skill,
    })
  }
  const nameForComponentType = componentTypeMap[componentType]
  const srcForComponentType = srcForIcons(nameForComponentType)

  return (
    <tr
      className={cx('tr', disabled && 'disabled')}
      onClick={handleSkillListItemClick}>
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
          <img className={s.typeLogo} src={srcForComponentType} />
          <p className={cx('typeText', nameForComponentType)}>
            {componentType || 'Type of Skill'}
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
        <div className={s.date}>
          <p className={s.ddmmyyyy}>{dateCreated}</p>
          <p className={s.time}>{time} </p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <ToggleButton handleToggle={handleToggle} />
          <Kebab
            dataFor='customizable_skill'
            item={{
              typeItem: name,
              data: skill, // Data of Element
            }}
          />
          {/* <div data-tip data-for='skill-add-interact'>
            <button
              className={s.area}
              onClick={handleAddBtnClick}
              disabled={disabledMsg !== undefined}>
              <PlusLogo />
            </button>
          </div> */}
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
