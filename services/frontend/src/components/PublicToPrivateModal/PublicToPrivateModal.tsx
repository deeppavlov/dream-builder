import { useState } from 'react'
import { useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { VISIBILITY_STATUS } from '../../constants/constants'
import { useAssistants } from '../../hooks/useAssistants'
import { useObserver } from '../../hooks/useObserver'
import { RoutesList } from '../../router/RoutesList'
import { BotInfoInterface, TDistVisibility } from '../../types/types'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { trigger } from '../../utils/events'
import s from './PublicToPrivateModal.module.scss'

type ActionTypes = 'edit' | 'rename'

export const PublicToPrivateModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [bot, setBot] = useState<BotInfoInterface | null>(null)
  const [action, setAction] = useState<ActionTypes | null>(null)
  const navigate = useNavigate()

  const handleEventUpdate = ({ detail }: any) => {
    setBot(detail?.bot)
    setAction(detail?.action)
    setIsOpen(!isOpen)
  }
  const queryClient = useQueryClient()
  const { changeVisibility } = useAssistants()
  const handleCancelClick = () => setIsOpen(false)

  const handleYesClick = () => {
    const name = bot?.name!
    const visibility = VISIBILITY_STATUS.PRIVATE as TDistVisibility
    action === 'edit' &&
      changeVisibility
        .mutateAsync({ name, visibility })
        .then(() => {
          setIsOpen(false)
        })
        .then(() => {
          navigate(generatePath(RoutesList.editor.skills, { name: bot?.name! }))
        })
    action === 'rename' &&
      changeVisibility
        .mutateAsync({ name, visibility })
        .then(() => {
          queryClient.invalidateQueries('publicDists')
          setIsOpen(false)
        })
        .then(() => {
          trigger('AssistantModal', { bot, action: 'edit' })
        })
  }

  useObserver('PublicToPrivateModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.publicToPrivateModal}>
        <div className={s.header}>
          Your assistant will be removed from public templates. Are you sure
          want to edit?
        </div>
        <div className={s.footer}>
          <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button>
          <Button theme='error' props={{ onClick: handleYesClick }}>
            Yes
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
