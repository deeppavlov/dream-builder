import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import { BaseModal, ConfirmApiTokenUpdate } from 'components/Modals'
import { AccessTokensModule } from 'components/Modules'
import s from './AccessTokensModal.module.scss'

export const AccessTokensModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { setUIOption } = useUIOptions()

  const handleEventUpdate = () => setIsOpen(true)

  useEffect(() => {
    setUIOption({ name: consts.SETTINGS_MODAL_IS_ACTIVE, value: isOpen })
  }, [isOpen])

  useObserver('AccessTokensModal', handleEventUpdate)

  return (
    <>
      <BaseModal
        id='accessTokensModal'
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalClassName={s.accessTokensModal}
      >
        <div className={s.scrollBox}>
          <AccessTokensModule />
        </div>
      </BaseModal>
      <ConfirmApiTokenUpdate />
    </>
  )
}
