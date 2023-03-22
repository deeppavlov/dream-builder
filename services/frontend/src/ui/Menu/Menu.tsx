import Logo from '../../assets/icons/logo.png'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Menu.module.scss'
import MenuToolTip from '../../components/MenuToolTip/MenuToolTip'

export type TMenu = 'main' | 'editor' | 'bots'

interface Props {
  type: TMenu
}

export const Menu = ({ type }: Props) => {
  return (
    <>
      <div className={s.menu} data-tip data-tooltip-id={type}>
        <img src={Logo} />
        <Arrow />
      </div>
      <MenuToolTip tooltipId={type} type={type} />
    </>
  )
}
