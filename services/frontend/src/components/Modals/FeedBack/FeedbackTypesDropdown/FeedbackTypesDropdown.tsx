import classNames from 'classnames/bind'
import React, { useRef, useState } from 'react'
import { Control, RegisterOptions, useController } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ArrowDownIcon } from 'assets/icons/arrow_down.svg'
import { IFeedbackType } from 'types/types'
import { serviceCompanyMap } from 'mapping/serviceCompanyMap'
import { useObserver } from 'hooks/useObserver'
import { SvgIcon } from 'components/Helpers'
import s from './FeedbackTypesDropdown.module.scss'

interface Props {
  list: IFeedbackType[]
  name: string
  control: Control<any>
  rules?: RegisterOptions
  label?: string
  props?: React.InputHTMLAttributes<HTMLInputElement>
}

const FeedbackTypesDropdown = ({
  name,
  control,
  rules,
  list,
  label,
  props,
}: Props) => {
  const getActiveItem = (id: number) => list?.find(item => item.id === id)

  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
    defaultValue: null,
  })
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.feedback.types',
  })
  const [isOpen, setIsOpen] = useState(false)
  const dropboxRef = useRef<HTMLDivElement | null>(null)
  let cx = classNames.bind(s)

  const toggleDropdown = () => {
    setIsOpen(prev => !prev)
  }

  const handleItemClick = (item: IFeedbackType) => {
    field.onChange(getActiveItem(item.id) ?? undefined)
    setIsOpen(false)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (!dropboxRef.current?.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  useObserver('click', handleClickOutside)

  return (
    <div className={cx('dropdown', isOpen && 'open', error && 'error')}>
      {label && (
        <span id='label' className={s.label}>
          {label}
        </span>
      )}

      <div className={s.inputBox} onClick={toggleDropdown} ref={dropboxRef}>
        <input
          {...props}
          {...field}
          value={field.value?.name ? t(field.value?.name) : ''}
          className={s.input}
          readOnly
        />
        <ArrowDownIcon className={cx('icon', 'arrowDown')} />
      </div>

      <ul className={s.list}>
        {list?.map((item, i) => {
          let serviceIconName = serviceCompanyMap?.[item?.name]

          return (
            <li
              key={`key-${i}`}
              className={cx(
                'item',
                item.id === field.value?.id && 'activeItem'
              )}
              onClick={() => handleItemClick(item)}
            >
              {serviceIconName && (
                <SvgIcon
                  iconName={serviceIconName}
                  svgProp={{ className: s.serviceIcon }}
                />
              )}
              <span>{t(item.name)}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default FeedbackTypesDropdown
