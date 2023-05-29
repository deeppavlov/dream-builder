import BaseLink from 'components/Unused/BaseLink/BaseLink'
import s from './SidePanelStatus.module.scss'

interface SidePanelStatusProps extends React.PropsWithChildren {
  status: 'default' | 'success' | 'error'
  title: string
  desc: string
  detailsLink?: string
}

const SidePanelStatus = ({
  status,
  title,
  desc,
  detailsLink,
  children,
}: SidePanelStatusProps) => {
  return (
    <div className={s.container}>
      <div className={s.mute}></div>
      <div className={`${s.sidePanelStatus} ${s[`sidePanelStatus_${status}`]}`}>
        <div className={s.sidePanelStatus__title}>
          {title}
          {detailsLink && (
            <BaseLink to={detailsLink} theme='link'>
              See details
            </BaseLink>
          )}
        </div>
        <p className={s.sidePanelStatus__desc}>{desc}</p>
        {/* Getting Buttons from children prop */}
        {children && <div className={s.sidePanelStatus__btns}>{children}</div>}
      </div>
    </div>
  )
}

export default SidePanelStatus
