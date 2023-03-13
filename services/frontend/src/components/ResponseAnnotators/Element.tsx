import { FC, useId, useState } from 'react'
import classNames from 'classnames/bind'
import { IContextMenu, IStackElement } from '../../types/types'
import { Kebab } from '../../ui/Kebab/Kebab'
import { modelTypeMap } from '../../Mapping/modelTypeMap'
import AnnotatorStackToolTip from '../AnnotatorStackToolTip/AnnotatorStackToolTip'
import s from './Element.module.scss'

interface ResponseAnnotatorsProps extends IContextMenu {
  annotator: IStackElement
}

export const Element: FC<ResponseAnnotatorsProps> = ({
  annotator,
  isPreview,
}) => {
  const [disabled, setDisabled] = useState<boolean>(true)
  const tooltipId = useId()
  const cx = classNames.bind(s)

  const sliderHandler = () => {
    setDisabled(disabled => !disabled)
  }

  return (
    <div className={cx('element', !disabled && 'disabled')}>
      <div className={s.left}>
        <div className={s.top}>
          <img
            src={`./src/assets/icons/${
              modelTypeMap[annotator?.model_type]
            }.svg`}
            className={s.icon}
          />
          <p className={s.name}>{annotator?.display_name}</p>
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {annotator?.ram_usage + ' RAM | ' + annotator?.gpu_usage + ' GPU'}
          </p>
        </div>
      </div>
      <div className={s.right}>
        <Kebab disabled={!disabled} tooltipId={tooltipId} />
        <AnnotatorStackToolTip
          annotator={annotator}
          tooltipId={tooltipId}
          isPreview={isPreview}
        />
      </div>
    </div>
  )
}
