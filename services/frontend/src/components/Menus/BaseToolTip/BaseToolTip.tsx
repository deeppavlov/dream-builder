import classNames from 'classnames/bind'
import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ITooltip, Tooltip } from 'react-tooltip'
import s from './BaseToolTip.module.scss'

interface Props extends ITooltip {
  theme?: 'small' | 'description'
}

const BaseToolTip = (props: Props) => {
  const [domReady, setDomReady] = React.useState(false)
  const container = document.body
  const [isVisible, setIsVisible] = useState<boolean>(props?.isOpen ?? false)
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
          setIsOpen={setIsVisible}
          className={cx(
            'container',
            'tooltip',
            props.theme && `${props.theme}`,
            isVisible && 'show'
          )}
          classNameArrow={s.arrow}
        />,
        container
      )
    : null
}

export default BaseToolTip
