import { useState } from 'react'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import { SkillType } from '../../types/types'
import s from './Element.module.scss'

interface skill {
  name: string
  display_name: string
  author: string
  type: SkillType
  description: string
  date_created: string
  execution_time: string | number
  gpu_usage: string | number
  ram_usage: string | number
  disk_usage: string | number
  version: string | number
}

export const Element = ({ item, title, ...props }: any) => {
  const [disabled, setDisabled] = useState(true)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  console.log(item)
  return (
    <div
      style={
        !disabled
          ? { ...props, opacity: '0.3', background: '#f0f0f3' }
          : undefined
      }
      className={s.element}>
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
              ' sec Ex.time' || '0.0 GB RAM | 0.00 sec Ex.time '}{' '}
          </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab
          disabled={!disabled}
          item={{
            typeItem: title, // Type of Element, like Intent Catcher, Intent Responder, FAQ etc.
            data: null, // Data of Element
          }}
          dataFor='customizable_skill'
        />
        <ToggleButton sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
