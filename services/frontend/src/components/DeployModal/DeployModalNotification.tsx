import { useState } from 'react'
import { useObserver } from '../../hooks/useObserver'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import SvgIcon from '../SvgIcon/SvgIcon'
import s from './DeployModalNotification.module.scss'

export const DeployModalNotification = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setIsBot] = useState<BotInfoInterface>()

  const handleEventUpdate = ({ detail }: any) => {
    setIsOpen(prev => !prev)
    setIsBot(detail)
  }

  const handleStart = () => setIsOpen(false)

  useObserver('DeployModalNotification', handleEventUpdate)

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
