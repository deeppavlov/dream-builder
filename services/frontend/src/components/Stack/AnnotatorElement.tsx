import classNames from 'classnames/bind'
import { FC, useId, useState } from 'react'
import { useUIOptions } from '../../context/UIOptionsContext'
import { modelTypeMap } from '../../mapping/modelTypeMap'
import { IStackElement } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { consts } from '../../utils/consts'
import { srcForIcons } from '../../utils/srcForIcons'
import AnnotatorStackToolTip from '../AnnotatorStackToolTip/AnnotatorStackToolTip'
import s from './AnnotatorElement.module.scss'

interface AnnotatorProps {
  annotator: IStackElement
  isPreview: boolean
  name?: string
}

export const AnnotatorElement: FC<AnnotatorProps> = ({
  annotator,
  isPreview,
  name,
}) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const { UIOptions } = useUIOptions()
  const isActive =
    UIOptions[consts.ACTIVE_ANNOTATOR_SP_ID] === name + annotator.name
  const tooltipId = useId()
  const cx = classNames.bind(s)

  const sliderHandler = () => setDisabled(disabled => !disabled)

  return (
    <div
      className={cx('element', !disabled && disabled)}
      data-active={isActive}
    >
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={srcForIcons(modelTypeMap[annotator?.model_type || ''])}
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
          name={name}
        />
      </div>
    </div>
  )
}
