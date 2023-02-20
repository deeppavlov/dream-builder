import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import { subscribe, unsubscribe } from '../../utils/events'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './PublishAssistantModal.module.scss'

interface IPublishBot extends Pick<BotInfoInterface, 'routingName' | 'name'> {}
interface IPublishAssistantModal {
  bot: IPublishBot
}

export const PublishAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setBot] = useState<IPublishBot | null>(null)
  let cx = classNames.bind(s)

  const handleEventUpdate = (data: { detail: IPublishAssistantModal }) => {
    setBot(data.detail.bot)
    setIsOpen(!isOpen)
  }

  const handleNoBtnClick = () => setIsOpen(false)

  const handlePublishBtnClick = () => {}

  useEffect(() => {
    subscribe('PublishAssistantModal', handleEventUpdate)
    return () => unsubscribe('PublishAssistantModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={cx('publishAssistantModal')}>
        <h4>
          Do you want to publish <mark>{bot?.name}</mark> to Virtual Assistants
          Store?
        </h4>
        <div className={cx('btns')}>
          <Button theme='secondary' props={{ onClick: handleNoBtnClick }}>
            No
          </Button>
          <Button
            theme='primary'
            props={{
              onClick: handlePublishBtnClick,
            }}>
            Publish
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
