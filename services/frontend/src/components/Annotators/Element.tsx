import { useState } from 'react'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import SkillLogo from '../../assets/icons/book.svg'
import s from './Element.module.scss'

export const Element = ({ item, title, ...props }: any) => {
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
          <img
            src={`./src/assets/icons/${item.type}.svg`}
            className={s.icon}></img>
          <p className={s.name}>{title || 'some_annotator'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>1.5 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab
          disabled={!disabled}
          dataFor='customizable_annotator'
          item={{
            typeItem: title, // Type of Element, like Intent Catcher, Intent Responder, FAQ etc.
            data: item, // Data of Element
          }}
        />
        {/* <ToggleButton sliderHandler={sliderHandler} /> */}
      </div>
    </div>
  )
}
