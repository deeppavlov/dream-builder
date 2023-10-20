import classNames from 'classnames/bind'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import GitHubLogo from 'assets/images/GitHubLogo.svg'
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
  const [msg, setMsg] = useState<MessageType | undefined>(propsMsg)
  let cx = classNames.bind(s)

  const handleClose = () => {
    clearBeforeLoginModal()
    setIsOpen(false)
  }

  const handleEventUpdate = (data: { detail: Props | null }) => {
    setMsg(data?.detail?.msg)
    if (data.detail?.requestModal)
      saveBeforeLoginModal(data.detail?.requestModal)
    setIsOpen(prev => !prev)
  }

  const handleGoogleSignIn = () => login.google()
  const handleGitHubSignIn = () => login.gitHub()

  useObserver('SignInModal', handleEventUpdate)

  return (
    <BaseModal
      modalClassName={s.modal}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      handleClose={handleClose}
    >
      <div className={s.container}>
        <h4 className={cx(!msg && 'h4')}>
          {msg || <Trans i18nKey='modals.sign_in.sign_in' />}
        </h4>

        <div className={s.btns}>
          <button className={cx('sign-in-btn')} onClick={handleGoogleSignIn}>
            <img src={GoogleLogo} alt='Google' />
            {t('btns.google_sign_in')}
          </button>
          <button className={cx('sign-in-btn')} onClick={handleGitHubSignIn}>
            <img src={GitHubLogo} alt='GitHub' />
            {t('btns.github_sign_in')}
          </button>
        </div>
      </div>
    </BaseModal>
  )
}
