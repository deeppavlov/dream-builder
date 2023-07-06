import { useState } from 'react'
import { BotInfoInterface } from 'types/types'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { BaseModal } from 'components/Modals'
import s from './PublishWarningModal.module.scss'

export const PublishWarningModal = () => {
  const [bot, setBot] = useState<BotInfoInterface>()
  const [isOpen, setIsOpen] = useState(false)

  const handleEventUpdate = (data: any) => {
    console.log('data = ', data.detail)
    setBot(data.detail?.bot)
    setIsOpen(prev => !prev)
  }

  useObserver('PublishWarningModal', handleEventUpdate)
  const handleCancel = () => setIsOpen(prev => !prev)

  const handleContinue = () => {
    console.log('continue')
  }
  return (
    <>
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={s.publishWarningModal}>
          <div className={s.header}>
            <div className={s.circle}>
              <SvgIcon iconName={'attention'} />
            </div>
            <h3 className={s.title}>Important</h3>
          </div>
          <div className={s.body}>
            <div className={s.upper}>
              When your assistant is added to "Public Templates," it goes
              through moderation. You can't edit it during this time. If
              approved, editing requires removal from public templates. If not
              approved, visibility reverts and you can freely edit it.
            </div>
            <div className={s.bottom}>
              Proceed with publishing your Assistant?
            </div>
          </div>
          <div className={s.footer}>
            <Button theme='secondary' props={{ onClick: handleCancel }}>
              Cancel
            </Button>
            <Button theme='primary' props={{ onClick: handleContinue }}>
              Continue
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  )
}
