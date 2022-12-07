import Logo from '../../assets/icons/logo.png'
import { MenuList } from '../../components/MenuList/MenuList'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Menu.module.scss'

export const Menu = props => {
  return (
    <div className={s.menu} data-tip data-for={props ? props.type : null}>
      <img src={Logo} />
      <Arrow />
      <MenuList type={props ? props.type : null} />
    </div>
  )
}
