import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import { subscribe, unsubscribe } from '../../utils/events'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './PublishAssistantModal.module.scss'

interface IPublishAssistantModal {
  bot: Pick<BotInfoInterface, 'routingName'>
}

export const PublishAssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  let cx = classNames.bind(s)

  const handleEventUpdate = (data: { detail: IPublishAssistantModal }) => {
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
          Do you want to{' '}
          <mark>
            publish to Dream Builder
          </mark>{' '}
          your distribution
          <br /> in <a href='#'>Dream Builder VA Store?</a>
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
