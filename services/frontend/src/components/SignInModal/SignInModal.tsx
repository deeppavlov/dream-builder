import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import GoogleLogo from '@assets/images/GoogleLogo.svg'
import BaseModal from '../../ui/BaseModal/BaseModal'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './SignInModal.module.scss'

type MessageType = JSX.Element | string

interface Props {
  msg?: MessageType
}

export const SignInModal = ({ msg: propsMsg }: Props) => {
  const [isOpen, setIsOpen] = useState(false)
  const [msg, setMsg] = useState<MessageType | null>(propsMsg ?? null)
  let cx = classNames.bind(s)

  const handleEventUpdate = (data: { detail: Props | null }) => {
    if (data.detail?.msg) setMsg(data.detail.msg)
    setIsOpen(!isOpen)
  }

  const handleSignInBtnClick = () => {
    // setIsOpen(false)
    // setMsg(null)
  }

  useEffect(() => {
    subscribe('SignInModal', handleEventUpdate)
    return () => unsubscribe('SignInModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={cx('signInModal')}>
        <h4>
          {/* span tag styled as primary color marked text */}
          {msg || (
            <>
              To build your own <span>Virtual Assistant</span>, please sign in
            </>
          )}
        </h4>
        <button className={cx('sign-in-btn')} onClick={handleSignInBtnClick}>
          <img src={GoogleLogo} alt='Google' />
          Sign in
        </button>
      </div>
    </BaseModal>
  )
}
