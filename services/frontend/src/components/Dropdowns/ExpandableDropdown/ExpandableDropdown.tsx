import classNames from 'classnames/bind'
import { useState } from 'react'
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow_down_link.svg'
import s from './ExpandableDropdown.module.scss'

interface ExpandableDropdownProps extends React.PropsWithChildren {
  placeholder: string
  title: string
  big?: boolean
}

const ExpandableDropdownn = ({
  placeholder,
  big,
  title,
  children,
}: ExpandableDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false)
  let cx = classNames.bind(s)

  return (
    <div className={cx('expandableDropdown', isOpen && 'active', big && 'big')}>
      {!isOpen && (
        <button className={s.placeholder} onClick={() => setIsOpen(true)}>
          {placeholder}
        </button>
      )}
      <ArrowDownIcon className={s.arrow} />
      {isOpen && (
        <div className={s.content}>
          <span className={s.title} onClick={() => setIsOpen(false)}>
            {title}
          </span>
          <div className={s.content}>{children}</div>
        </div>
      )}
    </div>
  )
}

export default ExpandableDropdownn
