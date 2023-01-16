import { useState } from 'react'
import BadWordsLogo from '../../assets/icons/bad_words.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({ title, ...props }: any) => {
  const [disabled, setDisabled] = useState(true)
  const sliderHandler = () => {
    setDisabled(!disabled)
  }
  return (
    <div
      style={
        !disabled ? { ...props, opacity: '0.3', background: '#f0f0f3' } : null
      }
      className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={BadWordsLogo} className={s.icon} />
          <p className={s.name}>{title}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>2.0 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} dataFor='customizable_annotator' />
        {/* <ToggleButton sliderHandler={sliderHandler} /> */}
      </div>
    </div>
  )
}
