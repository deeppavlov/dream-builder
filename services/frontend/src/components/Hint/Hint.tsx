import { useEffect, useState } from 'react'
import BaseToolTip from '../BaseToolTip/BaseToolTip'

interface Props {
  id: string
  handleClose: () => void
}

const Hint = ({ id, handleClose }: Props) => {
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
      id={id}
      children={
        <>
          Click here to control your Virtual Assistant: <br />
          annotators, skill & response selectors, and skills.
        </>
      }
      events={['click']}
      isOpen={!isHidden}
      place='right'
    />
  )
}
export default Hint
