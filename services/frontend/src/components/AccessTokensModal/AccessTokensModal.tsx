import { useEffect, useState } from 'react'
import { useDisplay } from '../../context/DisplayContext'
import { useObserver } from '../../hooks/useObserver'
import BaseModal from '../../ui/BaseModal/BaseModal'
import { consts } from '../../utils/consts'
import { AccessTokensModule } from '../AccessTokensModule/AccessTokensModule'
import { ConfirmApiTokenUpdate } from '../ConfirmApiTokenUpdate/ConfirmApiTokenUpdate'
import s from './AccessTokensModal.module.scss'

export const AccessTokensModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { dispatch } = useDisplay()

  const handleEventUpdate = () => setIsOpen(true)

  useEffect(() => {
    dispatch({
      type: 'set',
      option: {
        id: consts.SETTINGS_MODAL_IS_ACTIVE,
        value: isOpen,
      },
    })
  }, [isOpen])

  useObserver('AccessTokensModal', handleEventUpdate)

  return (
    <>
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} tokensModal>
        <div className={s.tokensModal}>
          <AccessTokensModule />
        </div>
      </BaseModal>
      <ConfirmApiTokenUpdate />
    </>
  )
}
