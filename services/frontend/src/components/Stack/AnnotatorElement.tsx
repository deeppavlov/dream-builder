import { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { IStackElement } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { modelTypeMap } from '../../mapping/modelTypeMap'
import AnnotatorStackToolTip from '../AnnotatorStackToolTip/AnnotatorStackToolTip'
import { srcForIcons } from '../../utils/srcForIcons'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
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
  const { options } = useDisplay()
  const isActive =
    options.get(consts.ACTIVE_ANNOTATOR_SP_ID) === name + annotator.name
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
