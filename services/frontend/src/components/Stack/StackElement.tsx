import { useState } from 'react'
import classNames from 'classnames/bind'
import { AnnotatorType, SkillType, StackType } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './StackElement.module.scss'
import { isSelector } from '../../utils/isSelector'

interface StackElementProps {
  item: {
    name: string
    display_name: string
    type: SkillType | AnnotatorType | 'skill_selector' | 'response_selector'
    is_active?: boolean
    is_editable?: boolean
    ram_usage?: string | number
    gpu_usage?: string | number
    execution_time?: string | number
  }
  type: StackType
}

export const StackElement: React.FC<StackElementProps> = ({ item, type }) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  let cx = classNames.bind(s)

  return (
    <div className={cx('element', !disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          {!isSelector(type) && (
            <img
              src={`./src/assets/icons/${item.type}.svg`}
              className={s.icon}
            />
          )}
          <p className={s.name}>{item.display_name || '_____'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {type == 'skills' && item.ram_usage && `RAM:${item.ram_usage}`}
          </p>
        </div>
      </div>
      <div className={s.right}>
        {type == 'skills' && (
          <Kebab disabled={!disabled} dataFor='non_customizable_skill' />
        )}
        {type == 'annotators' && (
          <Kebab disabled={!disabled} dataFor='non_customizable_annotator' />
        )}
        {/* need to fix dd menu */}
        {type == 'skills' && <ToggleButton sliderHandler={sliderHandler} />}
      </div>
    </div>
  )
}
