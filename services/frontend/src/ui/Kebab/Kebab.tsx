import { MenuList } from '../../components/MenuList/MenuList'
import s from './Kebab.module.scss'

export const Kebab = ({ disabled, type, item, color, dataFor }: any) => {
  const privateDataFor = () =>
    item?.typeItem ? dataFor + item.typeItem : dataFor
  return (
    <>
      <div
        onClick={(e) => { e.stopPropagation()}}
        disabled={disabled === undefined ? false : disabled}
        data-tip
        data-for={privateDataFor()}
        style={{ opacity: disabled && '0.3', flexDirection: `${type}` }}
        className={s.kebab}>
        <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
        <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
        <figure style={{ backgroundColor: `${color}` }} className={s.dots} />
      </div>
      <MenuList type={dataFor} item={item} privateDataFor={privateDataFor()} />
    </>
  )
}
