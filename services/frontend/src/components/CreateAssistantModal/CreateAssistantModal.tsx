import React, { useEffect, useState } from 'react'
import { useAuth } from '../../Context/AuthProvider'
import { BotInfoInterface, dist_list } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './CreateAssistantModal.module.scss'
import { RoutesList } from '../../Router/RoutesList'
import { useForm } from 'react-hook-form'
import { putAssistantDist } from '../../services/putAssistanDist'
import { useQueryClient } from 'react-query'

export const CreateAssistantModal = () => {
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [isOpen, setIsOpen] = useState(false)
  const [nameByUser, setNameByUser] = useState<string | null>(null)
  const [descByUser, setDescByUser] = useState<string | null>(null)
  const isHaveNameAndDesc = nameByUser !== null && descByUser !== null
  const auth = useAuth()

  const closeModal = () => {
    setIsOpen(false)
    setNameByUser(null)
    setDescByUser(null)
  }
  /**
   * Set modal is open and getting bot info
   */
  const handleEventUpdate = (data: { detail: BotInfoInterface | null }) => {
    setBot(data.detail?.name ? data.detail : null)
    setIsOpen(!isOpen)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setNameByUser(isValue ? value : null)
  }

  const handleDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target
    const isValue = value !== ''
    setDescByUser(isValue ? value : null)
  }

  const handleContinueBtnClick = () => {
    if (!isHaveNameAndDesc) return
    location.pathname = nameByUser
  }

  useEffect(() => {
    subscribe('CreateAssistantModal', handleEventUpdate)
    return () => unsubscribe('CreateAssistantModal', handleEventUpdate)
  }, [])

  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onFormSubmit = (data: any) => {
    if (!isHaveNameAndDesc) return
    putAssistantDist(data).then(() => {
      queryClient.invalidateQueries({ queryKey: 'usersAssistantDists' })
    })
    setTimeout(() => {
      location.pathname = nameByUser
    }, 1000)
  }
  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.createAssistantModal}>
        <div>
          <h4>Create a new virtual assistant</h4>
          <div className={s.createAssistantModal__distribution}>
            {bot ? (
              <div>
                You are using{' '}
                <span className={s.createAssistantModal__mark}>
                  {bot?.name}
                </span>{' '}
                distribution
              </div>
            ) : (
              <div>
                You are creating a distribution from{' '}
                <span className={s.createAssistantModal__mark}>scratch</span>
              </div>
            )}
          </div>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <Input
            label='Name'
            props={{
              placeholder: 'Enter name for your VA',
              ...register('dist_name', { required: true }),
            }}
            onChange={handleNameChange}
          />

          <TextArea
            label='Description'
            about={
              <div className={s['createAssistantModal__muted-text']}>
                Enter no more than 500 signs.
                <br />
                You will be able to edit this information later.
              </div>
            }
            props={{
              placeholder: 'Enter description for your VA',
              ...register('dist_description', { required: true }),
            }}
            onChange={handleDescChange}
          />
        </form>
        <div className={s.createAssistantModal__btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isHaveNameAndDesc,
              onClick: handleSubmit(onFormSubmit),
            }}>
            Continue
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
