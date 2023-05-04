import { ReactNode, useState } from 'react'
import { useObserver } from '../../hooks/useObserver'
import BaseToolTip from '../BaseToolTip/BaseToolTip'

interface Props {
  tooltipId: string
  name: string
  text: string | JSX.Element | Element | ReactNode
  handleClose: () => void
}

const Hint = ({ tooltipId, name, text, handleClose }: Props) => {
  const [isHidden, setIsHidden] = useState<boolean>(
    JSON.parse(`${localStorage.getItem(`${name}_IS_VISITED`)}`) === true
  )

  const handleClick = () => {
    setIsHidden(true)
    localStorage.setItem(`${name}_IS_VISITED`, JSON.stringify(true))
    handleClose()
  }

  useObserver('mousedown', handleClick)

  return (
    <BaseToolTip
      id={tooltipId}
      children={<>{text}</>}
      openOnClick
      isOpen={!isHidden}
      place='right'
    />
  )
}
export default Hint
