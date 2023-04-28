import classNames from 'classnames/bind'
import { FC, useRef } from 'react'
import { ReactComponent as LeftArrowIcon } from '../../assets/icons/arrow_left_copy.svg'
import { ReactComponent as RightArrowIcon } from '../../assets/icons/arrow_right.svg'
import { useDrag } from '../../hooks/useDrag'
import { sideScroll } from '../../utils/sideScroll'
import s from './Slider.module.scss'

type Props = {
  children?: React.ReactNode
  subWrapper?: boolean
}

export const Slider: FC<Props> = ({ children, subWrapper }) => {
  const cx = classNames.bind(s)
  const contentWrapper = useRef<HTMLDivElement>(null)
  useDrag(contentWrapper)
  return (
    <>
      <div className={s.wrapper} ref={contentWrapper}>
        {children}
      </div>
      <button
        className={cx('btnL', subWrapper && 'subWrapperL')}
        onClick={() => {
          sideScroll(contentWrapper.current!, 25, 300, -20)
        }}
      >
        <LeftArrowIcon />
      </button>
      <button
        className={cx('btnR', subWrapper && 'subWrapperR')}
        onClick={() => {
          sideScroll(contentWrapper.current!, 25, 300, 20)
        }}
      >
        <RightArrowIcon />
      </button>
    </>
  )
}
