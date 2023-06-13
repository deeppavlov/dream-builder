import { Link, LinkProps } from 'react-router-dom'
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow_down_link.svg'
import { ReactComponent as ArrowRightIcon } from 'assets/icons/arrow_right_link.svg'
import s from './BaseLink.module.scss'

interface BaseLinkProps extends LinkProps {
  theme: 'expand' | 'link'
  disabled?: boolean
}

const BaseLink = (props: BaseLinkProps) => {
  const { to, children, theme, disabled } = props

  return (
    <Link
      className={`${s.baseLink} ${theme && s[`baseLink_theme_${theme}`]} `}
      disabled={disabled}
      {...props}
      to={disabled ? '#' : to}
    >
      {children}
      <span className={s.baseLink__icon}>
        {theme === 'expand' && <ArrowDownIcon />}
        {theme === 'link' && <ArrowRightIcon />}
      </span>
    </Link>
  )
}

export default BaseLink
