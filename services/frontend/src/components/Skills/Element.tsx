import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import { usePreview } from '../../Context/PreviewProvider'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Skill } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

interface SkillProps {
  item: Skill
}

export const Element: FC<SkillProps> = ({ item }) => {
  const [disabled, setDisabled] = useState<boolean>(false)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  const isPreview = usePreview().isPreview
  const cx = classNames.bind(s)
  const title = capitalizeTitle(item.display_name)

  return (
    <div className={cx('element', disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={`./src/assets/icons/${item.type}.svg`} className={s.icon} />
          <p className={s.name}>{title || 'some_skill'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {item.ram_usage +
              ' RAM ' +
              '| ' +
              item.execution_time +
              ' s Time' || '0.0 GB RAM | 0.00 s '}
          </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab
          item={{
            typeItem: title,
            data: item, // Data of Element
          }}
          dataFor='customizable_skill'
        />
        <ToggleButton disabled={isPreview} sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
