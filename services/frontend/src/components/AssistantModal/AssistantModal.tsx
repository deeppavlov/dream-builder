import React, { useEffect, useState } from 'react'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './AssistantModal.module.scss'

type TAssistantModalAction = 'clone' | 'create' | 'edit'

interface IAssistantInfo
  extends Pick<BotInfoInterface, 'routingName' | 'name' | 'desc'> {}

interface IAssistantDistInfo
  extends Pick<BotInfoInterface, 'routingName' | 'name'> {}

interface IAssistantModal {
  action: TAssistantModalAction
  bot?: Partial<IAssistantInfo>
  distribution?: IAssistantDistInfo // The assistant that we clone
}

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAssistantModalAction | null>(null)
  const [bot, setBot] = useState<Partial<IAssistantInfo> | null>(null)
  const [botDist, setBotDist] = useState<IAssistantDistInfo | null>(null)
  const [name, setName] = useState<string | null>(null)
  const [desc, setDesc] = useState<string | null>(null)
  const isHaveNameAndDesc = name !== null && desc !== null

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)
    setBotDist(null)
    setName(null)
    setDesc(null)
  }

  const getRoutingName = () => name?.replace(/\s+/g, '_').toLowerCase()

  const handleEventUpdate = (data: { detail: IAssistantModal | null }) => {
    setAction(data.detail?.action ?? 'create') // Set 'create' action as default
    setBot(data.detail?.bot ?? null)
    setBotDist(data.detail?.distribution ?? null)
    if (data.detail?.action === 'edit') {
      setName(data.detail?.bot?.name ?? null)
      setDesc(data.detail?.bot?.desc ?? null)
    }
    setIsOpen(!isOpen)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setName(isValue ? value : null)
  }

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setDesc(isValue ? value : null)
  }

  const handleCreateBtnClick = () => {
    if (!isHaveNameAndDesc) return
    const routingName = getRoutingName()
    setBot({ ...bot, ...{ routingName } })
    location.pathname = routingName!
  }

  const handleCloneBtnClick = () => {
    if (!isHaveNameAndDesc) return
    const routingName = getRoutingName()
    setBot({ ...bot, ...{ routingName } })
    location.pathname = routingName!
  }

  const handleSaveBtnClick = () => {
    const isHaveChanges = name !== bot?.name || desc !== bot?.desc

    if (isHaveChanges) {
    }
    closeModal()
  }

  useEffect(() => {
    subscribe('AssistantModal', handleEventUpdate)
    return () => unsubscribe('AssistantModal', handleEventUpdate)
  }, [])

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} handleClose={closeModal}>
      <div className={s.assistantModal}>
        <div>
          {action === 'create' && <h4>Create a new virtual assistant</h4>}
          {action === 'clone' && <h4>Create clone of a virtual assistant</h4>}
          {action === 'edit' && <h4>Edit virtual assistant</h4>}
          <div className={s.distribution}>
            {action === 'clone' && (
              <div>
                You are creating a copy of a <mark>{botDist?.name}</mark>{' '}
                distribution
              </div>
            )}
            {action === 'create' && (
              <div>
                You are creating a new distribution from <mark>scratch</mark>
              </div>
            )}
            {action === 'edit' && (
              <div>
                You are editing <mark>{bot?.name}</mark> distribution
              </div>
            )}
          </div>
        </div>
        <Input
          label='Name'
          props={{
            required: true,
            placeholder: 'Enter name for your VA',
            value: name ?? undefined,
          }}
          onChange={handleNameChange}
          errorMessage='Please add name for your Virtual Assistant'
        />
        <TextArea
          label='Description'
          props={{
            required: true,
            placeholder: 'Enter description for your VA',
            value: desc ?? undefined,
          }}
          onChange={handleDescChange}
          about={
            <div className={s['text-muted']}>
              Enter no more than 500 signs.
              <br />
              You will be able to edit this information later.
            </div>
          }
          errorMessage={
            <div>
              Enter no more than 500 signs.
              <br />
              Please add description for your VA
            </div>
          }
        />
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isHaveNameAndDesc,
              onClick: () => {
                if (action == 'create') handleCreateBtnClick()
                if (action == 'clone') handleCloneBtnClick()
                if (action == 'edit') handleSaveBtnClick()
              },
            }}>
            {action === 'create' && 'Create'}
            {action === 'clone' && 'Clone'}
            {action === 'edit' && 'Save'}
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
