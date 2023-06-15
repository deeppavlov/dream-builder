import classNames from 'classnames/bind'
import { trigger } from 'utils/events'
import SvgIcon from 'components/Helpers/SvgIcon/SvgIcon'
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
  | 'profile'
  | 'logout'

interface Props {
  name?: string
  type?: TMenuItem
  theme?: 'dark'
  disabled?: boolean
  linkTo?: string
  children?: React.ReactNode
  handleClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
}

const ContextMenuButton = ({
  name,
  type,
  theme,
  disabled,
  linkTo,
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

  const getIconElement = (type: TMenuItem) => (
    <SvgIcon
      iconName={type === 'about' ? 'deeppavlov_dream-logo_light_vert' : type}
      svgProp={{
        className: cx('icon', type === 'about' && 'dreambuilder'),
      }}
    />
  )

  return (
    <button
      className={cx('item', disabled && 'disabled', theme && theme)}
      onClick={handleBtnClick}
    >
      {linkTo ? (
        <a
          href={linkTo}
          target='_blank'
          rel='noopener noreferrer'
          className={s.link}
        >
          {type && getIconElement(type)}
          {children || name}
        </a>
      ) : (
        <>
          {type && getIconElement(type)}
          <span>{children || name}</span>
        </>
      )}
    </button>
  )
}

export default ContextMenuButton