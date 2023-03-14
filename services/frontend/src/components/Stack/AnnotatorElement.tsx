import { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { Component } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { modelTypeMap } from '../../mapping/modelTypeMap'
import AnnotatorStackToolTip from '../AnnotatorStackToolTip/AnnotatorStackToolTip'
import { srcForIcons } from '../../utils/srcForIcons'
import s from './AnnotatorElement.module.scss'

interface AnnotatorProps {
  annotator: Component 
  isPreview: boolean
}

export const AnnotatorElement: FC<AnnotatorProps> = ({ annotator, isPreview }) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const tooltipId = useId()
  const cx = classNames.bind(s)

  const sliderHandler = () => setDisabled(disabled => !disabled)

  return (
    <div className={cx('element', !disabled && disabled)}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={srcForIcons(modelTypeMap[annotator?.model_type])}
            className={s.icon}
          />
          <p className={s.name}>{annotator?.display_name || '------'}</p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} tooltipId={tooltipId} />
        <AnnotatorStackToolTip
          annotator={annotator}
          tooltipId={tooltipId}
          isCustomizable={annotator?.is_customizable}
          isPreview={isPreview}
        />
      </div>
    </div>
  )
}
