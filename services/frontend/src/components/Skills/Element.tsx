import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import { usePreview } from '../../context/PreviewProvider'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Skill } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'
import { componentTypeMap } from '../../mapping/componentTypeMap'

interface SkillProps {
  item: Skill
}

export const Element: FC<SkillProps> = ({ item }) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  const { isPreview } = usePreview()
  const cx = classNames.bind(s)

  return (
    <div className={cx('element', disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={`./src/assets/icons/${
              componentTypeMap[item.component_type]
            }.svg`}
            className={s.icon}
          />
          <p className={s.name}>{item?.display_name || 'some_skill'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {item.ram_usage + ' RAM ' + '| ' + item.execution_time + 's Time' ||
              '0.0 GB RAM | 0.00 s '}
          </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab
          item={{
            typeItem: item.display_name,
            data: item, // Data of Element
          }}
          dataFor='customizable_skill'
        />
        <ToggleButton disabled={isPreview} sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
