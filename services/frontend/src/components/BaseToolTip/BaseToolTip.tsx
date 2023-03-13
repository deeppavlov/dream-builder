import classNames from 'classnames/bind'
import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Tooltip, ITooltip } from 'react-tooltip'
import s from './BaseToolTip.module.scss'

interface Props extends ITooltip {
  theme?: 'small' | 'description'
}

const BaseToolTip = (props: Props) => {
  const [domReady, setDomReady] = React.useState(false)
  const container = document.body

  let cx = classNames.bind(s)

  useEffect(() => {
    setDomReady(true)
  }, [])

  // React Portal is needeed to display tooltip overlay all content
  return domReady
    ? createPortal(
        <Tooltip
          delayShow={300}
          {...props}
          className={cx(
            'container',
            'tooltip',
            props.theme && `${props.theme}`
          )}
          classNameArrow={s.arrow}
        />,
        container
      )
    : null
}

export default BaseToolTip
