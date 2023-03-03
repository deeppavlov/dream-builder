import { FC } from 'react'
import classNames from 'classnames/bind'
import { MenuTypes } from '../../types/types'
import { MenuList } from '../../components/MenuList/MenuList'
import s from './Kebab.module.scss'

interface KebabProps {
  disabled?: boolean
  type?: 'row' | 'column'
  item?: any
  dataFor: MenuTypes
}

export const Kebab: FC<KebabProps> = ({ disabled, type, item, dataFor }) => {
  const privateDataFor = () =>
    item?.typeItem ? dataFor + item.typeItem : dataFor
  const clickHandler = (e: React.MouseEvent) => {
    e.stopPropagation()
  }
  const cx = classNames.bind(s)
  return (
    <>
      <button
        data-tip
        disabled={disabled}
        onClick={clickHandler}
        data-for={privateDataFor()}
        className={cx('kebab', type, disabled && 'disabled')}>
        <figure className={s.dots} />
        <figure className={s.dots} />
        <figure className={s.dots} />
      </button>
      <MenuList type={dataFor} item={item} privateDataFor={privateDataFor()} />
    </>
  )
}
