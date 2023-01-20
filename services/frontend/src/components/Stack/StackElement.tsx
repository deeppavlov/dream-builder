import { useState } from 'react'
import classNames from 'classnames/bind'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './StackElement.module.scss'

interface StackElement {
  item: string
  params: string
  type: string
}

export const StackElement = ({ item, params, type }: any) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  let cx = classNames.bind(s)
  return (
    <div className={cx('element', !disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={`./src/assets/icons/${type}`} className={s.icon} />
          <p className={s.name}>{item || '_____'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>{params || 'RAM:_._GB _._GB | Ex.t:__ms '}</p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} dataFor='customizable_skill' />
        {/* need to fix dd menu */}
        <ToggleButton sliderHandler={sliderHandler} />
      </div>
    </div>
  )
}
