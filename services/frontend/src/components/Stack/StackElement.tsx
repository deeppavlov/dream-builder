import { useState } from 'react'
import classNames from 'classnames/bind'
import { IStackElement, StackType } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { ToggleButton } from '../../ui/ToggleButton/ToggleButton'
import s from './StackElement.module.scss'
import { isSelector } from '../../utils/isSelector'
import { srcForIcons } from '../../utils/srcForIcons'
import { modelTypeMap } from '../../mapping/modelTypeMap'

interface StackElementProps {
  item: IStackElement
  type: StackType
}

export const StackElement: React.FC<StackElementProps> = ({ item, type }) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  let cx = classNames.bind(s)

  const sliderHandler = () => setDisabled(prev => !prev)

  return (
    <div className={cx('element', disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={srcForIcons(modelTypeMap[item?.model_type || ''])}
            className={s.icon}
          />
          <p className={s.name}>{item?.display_name || '------'}</p>
        </div>
      </div>
      <div className={s.right}>
        {/* <Kebab disabled={!disabled} tooltipId={tooltipId} />
      <AnnotatorStackToolTip
        annotator={annotator}
        tooltipId={tooltipId}
        isCustomizable={annotator?.is_customizable}
        isPreview={isPreview}
      /> */}
      </div>
    </div>
  )
}
