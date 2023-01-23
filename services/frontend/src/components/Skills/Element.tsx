import { useState } from 'react'
import SkillLogo from '../../assets/icons/skill_script.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({ item,title, ...props }: any) => {
  const [disabled, setDisabled] = useState(true)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
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
          <p className={s.data}>RAM:1.0 GB | Ex.t:00ms </p>
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
