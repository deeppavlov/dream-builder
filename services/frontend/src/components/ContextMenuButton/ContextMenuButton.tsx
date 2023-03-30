import classNames from 'classnames/bind'
import { stopPropagation } from '../../utils/stopPropagation'
import s from './ContextMenuButton.module.scss'

type TMenuItem =
  | 'edit'
  | 'properties'
  | 'delete'
  | 'publish'
  | 'clone'
  | 'duplicate'
  | 'disable'
  | 'enable'
  | 'add'
  | 'download'
  | 'share'
  | 'save'
  | 'about'

interface Props {
  name?: string
  type?: TMenuItem
  disabled?: boolean
  children?: React.ReactNode
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ContextMenuButton = ({
  name,
  type,
  disabled,
  children,
  handleClick,
}: Props) => {
  let cx = classNames.bind(s)
  const handleBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    handleClick && handleClick(e)
  }

  return (
    <button className={s.item} disabled={disabled} onClick={handleBtnClick}>
      {type && (
        <img
          onClick={stopPropagation}
          className={cx('icon', type === 'about' && 'dreambuilder')}
          src={`./src/assets/icons/${
            type === 'about' ? 'deeppavlov_dream-logo_light_vert' : type
          }.svg`}
        />
      )}
      <span onClick={stopPropagation}>{children || name}</span>
    </button>
  )
}

export default ContextMenuButton
