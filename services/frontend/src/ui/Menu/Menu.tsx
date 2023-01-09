import Logo from '../../assets/icons/logo.png'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import { MenuList } from '../../components/MenuList/MenuList'
import s from './Menu.module.scss'

type Props = { type: string }

export const Menu: React.FC<Props> = ({ type }) => {
  return (
    <div className={s.menu} data-tip data-for={type || null}>
      <img src={Logo} />
      <Arrow />
      <MenuList type={type || null} />
    </div>
  )
}
