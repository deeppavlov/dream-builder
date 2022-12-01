import Logo from '../../assets/icons/logo.png'
import { MenuList } from '../../components/MenuList/MenuList'
import { ReactComponent as Arrow } from '../../assets/icons/arrow_down.svg'
import s from './Menu.module.scss'

export const Menu = () => {
    console.log(this)
  return (
    <button className={s.menu} data-tip data-for='main_menu'>
      <img src={Logo} />
      <Arrow />
      <MenuList />
    </button>
  )
}
