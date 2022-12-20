import { useState } from 'react'
import SkillLogo from '../../assets/icons/skill_script.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

export const Element = ({...props}) => {
  const [disabled, setDisabled] = useState(true)
  const sliderHandler = () => {
    setDisabled(!disabled)
    console.log('skill state was changed')
    console.log(disabled)
  }
  return (
    <div
      style={
        !disabled ? { ...props, opacity: '0.3', background: '#f0f0f3' } : null
      }
      className={s.element}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={SkillLogo} className={s.icon} />
          <p className={s.name}>DFF Program Y</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>RAM:1.0 GB 0.0 GB | Ex.t:00ms </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} dataFor='customizable_skill' />
        <ToggleButton sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
