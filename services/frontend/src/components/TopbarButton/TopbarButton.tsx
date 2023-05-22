import { useNavigate } from 'react-router-dom'
import s from './TopbarButton.module.scss'

interface Props {
  children?: JSX.Element | React.ReactNode | string
  dataTooltipId?: string
  to?: string
  onClick?: (e: React.MouseEvent) => void
}

const TopbarButton = ({ children, dataTooltipId, to, onClick }: Props) => {
  const nav = useNavigate()
  return (
    <button
      className={s.topbarBtn}
      type='button'
      data-tooltip-id={dataTooltipId}
      onClick={e => (to ? nav(to) : onClick && onClick(e))}
    >
      <div className={s.content}>{children}</div>
    </button>
  )
}

export default TopbarButton
