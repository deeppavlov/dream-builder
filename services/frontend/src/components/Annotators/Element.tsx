import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import SkillLogo from '../../assets/icons/book.svg'
import s from './Element.module.scss'
import { useState } from 'react'

export const Element = ({ ...props }) => {
  const [disabled, setDisabled] = useState(true)
  const sliderHandler = () => {
    setDisabled(!disabled)
    console.log('skill state was changed')
    console.log(disabled)
  }
  return (
    <div
      style={
        !disabled ? { ...props, opacity: '0.3', background: '#f0f0f3' } : undefined
      }
      className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={SkillLogo} className={s.icon}></img>
          <p className={s.name}>Fact Retrieval</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>1.5 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} dataFor='customizable_annotator' />
        <ToggleButton sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
