import classNames from 'classnames/bind'
import { useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { IBeforeLoginModal } from 'types/types'
import { login } from 'api/user'
import { useObserver } from 'hooks/useObserver'
import {
  clearBeforeLoginAnalyticsState,
  clearBeforeLoginModal,
  saveBeforeLoginModal,
} from 'utils/beforeSignInManager'
import { Button } from 'components/Buttons'
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
    clearBeforeLoginAnalyticsState()
    setIsOpen(false)
  }

  const handleEventUpdate = (data: { detail: Props | null }) => {
    setMsg(data?.detail?.msg)
    if (data.detail?.requestModal)
      saveBeforeLoginModal(data.detail?.requestModal)
    setIsOpen(prev => !prev)
  }

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

        <Button theme='secondary' long props={{ onClick: login.gitHub }}>
          <Trans i18nKey='modals.sign_in.sign_in' />
        </Button>
      </div>
    </BaseModal>
  )
}
