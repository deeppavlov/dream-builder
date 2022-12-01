import { BurgerMenu } from '../../components/MenuList/MenuList'
import s from './BurgerButton.module.scss'

export const BurgerButton = () => {
  return (
    <button data-tip data-for='burgermenu' className={s.menu}>
      <span className={s.brgr_menu} />
      <span className={s.brgr_menu} />
      <BurgerMenu />
    </button>
  )
}
