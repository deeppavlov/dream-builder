import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import { BaseModal, ConfirmApiTokenUpdate } from 'components/Modals'
import { AccessTokensModule } from 'components/Modules'

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
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <AccessTokensModule />
      </BaseModal>
      <ConfirmApiTokenUpdate />
    </>
  )
}
