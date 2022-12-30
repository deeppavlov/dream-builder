import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { getCookie, useAuth } from '../../services/AuthProvider'
import { BotInfoInterface, dist_list } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { TextArea } from '../../ui/TextArea/TextArea'
import { subscribe, unsubscribe } from '../../utils/events'
import s from './CreateAssistantModal.module.scss'

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

    // metadata: {
    //   display_name: nameByUser,
    //   date: new Date(),
    //   author: `${auth?.user?.name}`,
    //   description: descByUser,
    //   version: '0.0.1',
    //   ram_usage: '0.0 GB',
    //   gpu_usage: '0.0 GB',
    //   disk_usage: '0.0 GB',
    // },

    // const va = {
    //   name: nameByUser.replace(/\s+/g, '_').toLowerCase(),
    //   data: JSON.parse(JSON.stringify(vaPostBody.data)),
    // }

    // let config = {
    //   mode: 'no-cors',
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //     token: `${getCookie('jwt_token')}`,
    //     dist_name: va.name,
    //   },
    // }

    // axios
    //   .post(`http://10.11.1.8:7000/api/assistant_dists/${va.name}`, va, config)
    //   .then(({ data }) => console.log(data))
    //   .catch(e => console.log(e.response.data))
    location.pathname = '/editor'
  }

  useEffect(() => {
    subscribe('CreateAssistantModal', handleEventUpdate)
    return () => unsubscribe('CreateAssistantModal', handleEventUpdate)
  }, [])

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
        <Input
          label='Name'
          props={{
            placeholder: 'Enter name for your VA',
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
          // errorMessage={
          //   <div>
          //     Enter no more than 500 signs.
          //     <br />
          //     Please add description for your VA
          //   </div>
          // }
          props={{ placeholder: 'Enter description for your VA' }}
          onChange={handleDescChange}
        />
        <div className={s.createAssistantModal__btns}>
          <Button theme='secondary' props={{ onClick: closeModal }}>
            Cancel
          </Button>
          <Button
            theme='primary'
            props={{
              disabled: !isHaveNameAndDesc,
              onClick: handleContinueBtnClick,
            }}>
            Continue
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
