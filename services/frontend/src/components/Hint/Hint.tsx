import { FC, useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import { setVisited } from '../../utils/setVisited'
import s from './Hint.module.scss'

const Hint: FC = () => {
  const [hidden, setHidden] = useState<any>(localStorage.getItem('isVisited'))
  const cx = classNames.bind(s)
  useEffect(() => {
    const handleClick = () => {
      setHidden(true)
      setVisited()
    }
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('mousedown', handleClick)
    }
  }, [])
  return (
    <div className={cx('hint', hidden && 'hidden')}>
      Click here to control your Virtual Assistant: <br />
      annotators, skill & response selectors, and skills.
      <span className={s.arrow} />
    </div>
  )
}
export default Hint
