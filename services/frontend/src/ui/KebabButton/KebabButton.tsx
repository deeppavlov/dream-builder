import { ReactComponent as KebabLogoSVG } from '../../assets/icons/kebab.svg'
import { MenuList } from '../../components/MenuList/MenuList'
import s from './KebabButton.module.scss'

export const KebabButton = ({ dataFor }: any) => {
  return (
    <button data-tip data-for={dataFor} className={s.kebab}>
      <KebabLogoSVG />
      <MenuList type={dataFor} />
    </button>
  )
}
