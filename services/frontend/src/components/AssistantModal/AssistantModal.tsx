import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
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
  const {
    register,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' })
  const [NAME_ID, DESC_ID] = ['assistant_name', 'assistant_desc']

  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)
    setBotDist(null)
  }

  const generateRoutingName = (name: string) =>
    name?.replace(/\s+/g, '_').toLowerCase()

  const handleEventUpdate = (data: { detail: IAssistantModal | null }) => {
    setAction(data.detail?.action ?? 'create') // Set 'create' action as default
    setBot(data.detail?.bot ?? null)
    setBotDist(data.detail?.distribution ?? null)
    // Reset clear values and errors states
    reset({
      [NAME_ID]: data?.detail?.bot?.name,
      [DESC_ID]: data?.detail?.bot?.desc,
    })
    setIsOpen(!isOpen)
  }

  const handleCreateBtnClick = () => {
    if (!isValid) return
    const [name, desc] = [getValues()[NAME_ID], getValues()[DESC_ID]]
    const routingName = generateRoutingName(name)
    const newBot = { ...bot, ...{ routingName, name, desc } }
    // Create bot logic here...
    location.pathname = routingName!
  }

  const handleCloneBtnClick = () => {
    if (!isValid) return
    const [name, desc] = [getValues()[NAME_ID], getValues()[DESC_ID]]
    const routingName = generateRoutingName(name)
    const newBot = { ...bot, ...{ routingName, name, desc } }
    // Clone bot logic here...
    location.pathname = routingName!
  }

  const handleSaveBtnClick = () => {
    if (!isValid) return
    const [name, desc] = [getValues()[NAME_ID], getValues()[DESC_ID]]
    const newBot = { ...bot, ...{ name, desc } }
    // Save bot logic here...
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
          error={errors[NAME_ID]}
          props={{
            placeholder: 'Enter name for your VA',
            value: getValues()[NAME_ID],
            ...register(NAME_ID, {
              required: 'Please add name for your Virtual Assistant',
            }),
          }}
        />
        <TextArea
          label='Description'
          withCounter
          error={errors[DESC_ID]}
          about={
            <div className={s['text-muted']}>
              You will be able to edit this information later.
            </div>
          }
          props={{
            placeholder: 'Enter description for your VA',
            value: getValues()[DESC_ID],
            ...register(DESC_ID, {
              required: 'Please add description for your Virtual Assistant.',
              maxLength: {
                value: 500,
                message: 'You’ve reached limit of the signs.',
              },
            }),
          }}
        />
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isValid,
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
