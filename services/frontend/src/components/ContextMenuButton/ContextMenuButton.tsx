import classNames from 'classnames/bind'
import { trigger } from '../../utils/events'
import SvgIcon from '../SvgIcon/SvgIcon'
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
  | 'architecture'
  | 'chat'

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
    trigger('CtxMenuBtnClick', {})
    if (disabled) return
    handleClick && handleClick(e)
  }

  return (
    <button
      className={cx('item', disabled && 'disabled')}
      onClick={handleBtnClick}
    >
      {type && (
        <SvgIcon
          iconName={
            type === 'about' ? 'deeppavlov_dream-logo_light_vert' : type
          }
          svgProp={{
            className: cx('icon', type === 'about' && 'dreambuilder'),
          }}
        />
        // <img
        //   className={cx('icon', type === 'about' && 'dreambuilder')}
        //   src={`./src/assets/icons/${
        //     type === 'about' ? 'deeppavlov_dream-logo_light_vert' : type
        //   }.svg`}
        // />
      )}
      <span>{children || name}</span>
    </button>
  )
}

export default ContextMenuButton
