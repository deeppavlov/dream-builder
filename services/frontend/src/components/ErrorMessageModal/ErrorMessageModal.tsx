import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './ErrorMessageModal.module.scss'

export const ErrorMessageModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)
  let cx = classNames.bind(s)

  const handleEventUpdate = (data: { detail: string | null }) => {
    setMsg(data.detail)
    setIsOpen(!isOpen)
  }

  const handleGoHomeBtnClick = () => {
    setIsOpen(false)
    setMsg(null)
    location.pathname = '/'
  }

  useEffect(() => {
    subscribe('ErrorMessageModal', handleEventUpdate)
    return () => unsubscribe('ErrorMessageModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={cx('errorMessageModal')}>
        <h4>Error: {msg}</h4>
        <div className={cx('btns')}>
          <Button
            theme='primary'
            props={{
              onClick: handleGoHomeBtnClick,
            }}>
            OK
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
