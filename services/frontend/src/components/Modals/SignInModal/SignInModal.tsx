import classNames from 'classnames/bind'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import GoogleLogo from 'assets/images/GoogleLogo.svg'
import { IBeforeLoginModal } from 'types/types'
import { login } from 'api/user'
import { useObserver } from 'hooks/useObserver'
import {
  clearBeforeLoginModal,
  saveBeforeLoginModal,
} from 'utils/beforeSignInManager'
import { BaseModal } from 'components/Modals'
import s from './SignInModal.module.scss'

type MessageType = JSX.Element | string

interface Props {
  msg?: MessageType
  requestModal?: IBeforeLoginModal
}

export const SignInModal = ({ msg: propsMsg }: Props) => {
  const { t } = useTranslation('translation', { keyPrefix: 'modals.sign_in' })
  const [isOpen, setIsOpen] = useState(false)
  const [msg, setMsg] = useState<MessageType | null>(propsMsg ?? null)
  let cx = classNames.bind(s)

  const handleClose = () => {
    clearBeforeLoginModal()
    setIsOpen(false)
  }

  const handleEventUpdate = (data: { detail: Props | null }) => {
    if (data.detail?.msg) setMsg(data.detail.msg)
    if (data.detail?.requestModal)
      saveBeforeLoginModal(data.detail?.requestModal)
    setIsOpen(prev => !prev)
  }

  const handleSignInBtnClick = () => login()

  useObserver('SignInModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={handleClose}>
      <div className={cx('signInModal')}>
        <h4>
          {/* span tag styled as primary color marked text */}
          {msg || <Trans i18nKey='modals.sign_in.header' />}
        </h4>
        <button className={cx('sign-in-btn')} onClick={handleSignInBtnClick}>
          <img src={GoogleLogo} alt='Google' />
          {t('btns.sign_in')}
        </button>
      </div>
    </BaseModal>
  )
}
