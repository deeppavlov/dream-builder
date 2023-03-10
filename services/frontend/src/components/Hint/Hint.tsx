import { FC, useEffect, useState } from 'react'
import BaseToolTip from '../BaseToolTip/BaseToolTip'
import s from './Hint.module.scss'

interface Props {
  handleClose: () => void
}

const Hint = ({ handleClose }: Props) => {
  const [isHidden, setIsHidden] = useState<boolean>(
    JSON.parse(`${localStorage.getItem('HINT_IS_VISITED')}`) === true
  )

  const handleClick = () => {
    setIsHidden(true)
    localStorage.setItem('HINT_IS_VISITED', JSON.stringify(true))
    handleClose()
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])

  return (
    <BaseToolTip
      id='sidebarBotTab'
      children={
        <>
          Click here to control your Virtual Assistant: <br />
          annotators, skill & response selectors, and skills.
        </>
      }
      isOpen={!isHidden}
      place='right'
    />
  )
}
export default Hint
