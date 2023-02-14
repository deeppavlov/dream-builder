import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useQueryClient, useMutation } from 'react-query'
import { putAssistantDist } from '../../services/putAssistanDist'
import { BotInfoInterface } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import { useNavigate } from 'react-router-dom'
import { generateRoutingName } from '../../utils/generateRoutingName'
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

// думаю стоит убрать из модалки стэйты, связанные с дистрибутивом (поправь, если считаешь иначе)
// по мне, задача этого модального окна - выступить посредником между клиентом и компонентами, выполняющими работу с данными (форма, наша либа для запросов)
// исходя из этого модалке не нужен стэйт для хранения информации о дистрибутиве, модалка лишь посредник
// я бы убрал все шаги, в которых ты сохраняешь состояние форм, прежде чем передать их дальше
// и не передавать внутрь данные, которые не нужны для работы модалки
// (можно представить курьера, который перевозит посылки - ему не нужно знать, что внутри). он доставляет коробку из пункта А в пункт В
// это все мысли про Single Responsibility, снизу ссылки про этот принцип, и то как он интегрируется в архитектуру react
// https://blog.devgenius.io/single-responsibility-principle-within-the-react-ecosystem-155650ab7a00
// https://blog.bitsrc.io/single-responsibility-principle-for-react-js-applications-5cde2fd49f11
// PS я бы хотел, чтобы ты в подобном ключе писал свои мысли о моих компонентах, это поможет нам быстрее расти и делать код проекта лучше

export const AssistantModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [action, setAction] = useState<TAssistantModalAction | null>(null)
  const [bot, setBot] = useState<Partial<IAssistantInfo> | null>(null)
  const [botDist, setBotDist] = useState<IAssistantDistInfo | null>(null)
  const {
    handleSubmit,
    register,
    reset,
    getValues,
    formState: { errors, isValid },
  } = useForm({ mode: 'all' })
  const [NAME_ID, DESC_ID] = ['display_name', 'description']
  const navigate = useNavigate()
  const closeModal = () => {
    setIsOpen(false)
    setAction(null)
    setBot(null)
    setBotDist(null)
  }

  const handleEventUpdate = (data: { detail: IAssistantModal | null }) => {
    setAction(data.detail?.action ?? 'create') // Set 'create' action as default
    // классно, что ты пишешь пояснительные комментарии, тоже возьму на заметку
    setBot(data.detail?.bot ?? null)
    setBotDist(data.detail?.distribution ?? null)
    // Reset clear values and errors states
    reset({
      [NAME_ID]: data?.detail?.bot?.name,
      [DESC_ID]: data?.detail?.bot?.desc,
    })
    setIsOpen(!isOpen)
  }

  const handleCreateBtnClick = async () => {
    if (!isValid) return
    const [name, desc] = [getValues()[NAME_ID], getValues()[DESC_ID]] // TODO: remove?
    const routingName = generateRoutingName(name) // TODO: remove?
    const newBot = { ...bot, ...{ routingName, name, desc } } // TODO: remove?
    // Create bot logic here...
    handleSubmit(onFormSubmit)
  }

  const handleCloneBtnClick = () => {
    if (!isValid) return
    const [name, desc] = [getValues()[NAME_ID], getValues()[DESC_ID]]
    const routingName = generateRoutingName(name) // TODO: remove?
    // нам не придется генерировать routingName, мы получим его в респонсе запроса PUT на сервер (генерировать routingName - задача только бэкенда, так у нас точно не будет расхождений)
    // учитывая, что операция асинхронная, нам это только на руку - пользователь не сможет открыть дистрибутив, пока на бэке не произойдет его клонирование
    const newBot = { ...bot, ...{ routingName, name, desc } } // TODO: remove?
    // Clone bot logic here...
    // navigate(`/${name}`)
  }

  const handleSaveBtnClick = () => {
    if (!isValid) return
    const [name, desc] = [getValues()[NAME_ID], getValues()[DESC_ID]]
    const newBot = { ...bot, ...{ name, desc } } // TODO: remove?
    // Save bot logic here...
    closeModal()
  }

  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: (data: any) => {
      // TODO: (A) add typization
      return putAssistantDist(data)
    },
    onSuccess: data => {
      queryClient
        .invalidateQueries({ queryKey: 'usersAssistantDists' })
        .then(() => {
          navigate(`/${data?.name}`, {
            state: { preview: false, distName: data?.name },
          })
        })
    },
  })

  const onFormSubmit = (data: any) => {
    // TODO: (A) add typization
    mutation.mutate(data)
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
        <form onSubmit={handleSubmit(onFormSubmit)}>
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
        </form>
      </div>
    </BaseModal>
  )
}
