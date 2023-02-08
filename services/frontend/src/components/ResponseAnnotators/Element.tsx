import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import { Annotator } from '../../types/types'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

interface ResponseAnnotatorsProps {
  item: Annotator
}

export const Element: FC<ResponseAnnotatorsProps> = ({ item }) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  const title = capitalizeTitle(item.display_name)
  const cx = classNames.bind(s)

  return (
    <div className={cx('element', !disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img src={`./src/assets/icons/${item.type}.svg`} className={s.icon} />
          <p className={s.name}>{title}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {item?.ram_usage + ' RAM | ' + item?.gpu_usage + ' GPU'}
          </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} dataFor='customizable_annotator' />
        {/* <ToggleButton sliderHandler={sliderHandler} /> */}
      </div>
    </div>
  )
}
