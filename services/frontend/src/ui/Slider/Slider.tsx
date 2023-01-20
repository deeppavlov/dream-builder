import { useRef } from 'react'
import { useDrag } from '../../hooks/useDrag'
import { sideScroll } from '../../utils/sideScroll'
import { ReactComponent as LeftArrowIcon } from '../../assets/icons/arrow_left_copy.svg'
import { ReactComponent as RightArrowIcon } from '../../assets/icons/arrow_right.svg'
import s from './Slider.module.scss'

type Props = {
  children?: React.ReactNode
}

export const Slider: React.FC<Props> = ({ children }) => {
  const contentWrapper = useRef<HTMLDivElement>(null)
  useDrag(contentWrapper)
  return (
    <>
      <div className={s.wrapper} ref={contentWrapper}>
        {children}
      </div>
      <button
        className={s.btnL}
        onClick={() => {
          sideScroll(contentWrapper.current!, 25, 300, -20)
        }}>
        <LeftArrowIcon />
      </button>
      <button
        className={s.btnR}
        onClick={() => {
          sideScroll(contentWrapper.current!, 25, 300, 20)
        }}>
        <RightArrowIcon />
      </button>
    </>
  )
}
