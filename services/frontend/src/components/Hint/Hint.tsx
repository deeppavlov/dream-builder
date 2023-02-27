import { FC, useState } from 'react'
import classNames from 'classnames/bind'
import { setVisited } from '../../utils/setVisited'
import s from './Hint.module.scss'

const Hint: FC = () => {
  const [hidden, setHidden] = useState<any>(localStorage.getItem('isVisited'))

  const clickHandler = () => {
    setHidden((hidden: any) => !hidden)
    setVisited()
  }
  const cx = classNames.bind(s)
  return (
    <button onClick={clickHandler} className={cx('hint', hidden && 'hidden')}>
      Click here to control your Virtual Assistant: <br />
      annotators, skill & response selectors, and skills.
      <span className={s.arrow} />
    </button>
  )
}
export default Hint
