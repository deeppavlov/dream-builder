import { useDisplay } from 'context'
import { useEffect, useState } from 'react'
import { useObserver } from 'hooks/useObserver'
import { consts } from 'utils/consts'
import { BaseModal, ConfirmApiTokenUpdate } from 'components/Modals'
import { AccessTokensModule } from 'components/Modules'

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
      <BaseModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        tokensModal
        customStyles={{ overlay: { top: 64 } }}
      >
        <AccessTokensModule />
      </BaseModal>
      <ConfirmApiTokenUpdate />
    </>
  )
}
