import classNames from 'classnames/bind'
import { Tooltip, ITooltip } from 'react-tooltip'
import s from './BaseToolTip.module.scss'

interface Props extends ITooltip {
  theme?: 'small' | 'description'
}

const BaseToolTip = (props: Props) => {
  let cx = classNames.bind(s)

  return (
    <div className={s.container}>
      <Tooltip
        {...props}
        className={cx('tooltip', props.theme && `${props.theme}`)}
        classNameArrow={s.arrow}
      />
    </div>
  )
}

export default BaseToolTip
