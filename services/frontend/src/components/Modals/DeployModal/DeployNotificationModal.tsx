import { useState } from 'react'
import { BotInfoInterface } from 'types/types'
import { useObserver } from 'hooks/useObserver'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { BaseModal } from 'components/Modals'
import s from './DeployNotificationModal.module.scss'

export const DeployNotificationModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setIsBot] = useState<BotInfoInterface>()

  const handleEventUpdate = ({ detail }: any) => {
    setIsOpen(prev => !prev)
    setIsBot(detail)
  }

  const handleStart = () => setIsOpen(false)

  useObserver('DeployNotificationModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.deployNotification}>
        <div className={s.body}>
          <SvgIcon iconName={'success'} />
          <p className={s.notification}>
            {bot?.display_name}
            <br />
            has been built!
          </p>
          <p className={s.annotation}>
            Now you can chat with your virtual assistant
          </p>
        </div>
        <div className={s.footer}>
          <Button theme='primary' props={{ onClick: handleStart }}>
            Start Chatting →
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
