import { BurgerMenu } from '../../BurgerMenu/BurgerMenu'
import s from './Menu.module.scss'

export const TopbarMenu = () => {
  return (
    <button data-tip data-for='burgermenu' className={s.menu}>
      <span className={s.brgr_menu} />
      <span className={s.brgr_menu} />
      <BurgerMenu />
    </button>
  )
}
