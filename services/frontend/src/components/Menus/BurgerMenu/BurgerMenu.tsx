import { ReactComponent as Arrow } from 'assets/icons/arrow_down.svg'
import Logo from 'assets/icons/logo.png'
import { BotInfoInterface, TTopbar } from 'types/types'
import { MenuToolTip } from 'components/Menus'
import s from './BurgerMenu.module.scss'

interface Props {
  type: TTopbar
  dist: BotInfoInterface
}

export const BurgerMenu = ({ type, dist }: Props) => {
  return (
    <>
      <div className={s.menu} data-tip data-tooltip-id={type}>
        <img src={Logo} />
        <Arrow />
      </div>
      <MenuToolTip tooltipId={type} type={type} bot={dist} />
    </>
  )
}
