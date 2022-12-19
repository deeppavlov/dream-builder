import { MenuList } from '../../components/MenuList/MenuList'
import s from './Kebab.module.scss'

export const Kebab = ({ disabled, type, color, dataFor }: any) => {
  console.log(disabled)
  return (
    <button
      disabled={disabled === undefined ? false : disabled}
      data-tip
      data-for={dataFor}
      style={{ opacity: disabled && '0.3', flexDirection: `${type}` }}
      className={s.kebab}>
      <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
      <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
      <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
      <MenuList type={dataFor} />
    </button>
  )
}
