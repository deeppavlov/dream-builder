import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import { Annotator } from '../../types/types'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './Element.module.scss'

interface AnnotatorProps {
  item: Annotator
}

export const Element: FC<AnnotatorProps> = ({ item }) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }
  const cx = classNames.bind(s)
  const title = capitalizeTitle(item.display_name)

  return (
    <div className={cx('element', !disabled && disabled)}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={`./src/assets/icons/${item.type}.svg`}
            className={s.icon}></img>
          <p className={s.name}>{title || 'some_annotator'}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {item?.ram_usage + ' RAM | ' + item?.gpu_usage + ' GPU'}
          </p>
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
