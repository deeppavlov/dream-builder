import { useState } from 'react'
import { useQuery } from 'react-query'
import { getAllLMservices } from 'api/components'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { TextArea } from 'components/Inputs'
import { BaseModal } from 'components/Modals'
import s from './CreateGenerativeSkillModal.module.scss'

interface ILmService {
  name: string
  display_name: string
  id: number
  description: string
  project_url: string
}

export const CreateGenerativeSkillModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [info, setInfo] = useState()

  const { data: lmServices } = useQuery('lm_services', getAllLMservices)

  const handleBackClick = () => trigger('SkillModal', { info })

  const handleCreateClick = () => {}

  const handleEventUpdate = (data: any) => {
    setInfo(data?.detail)
    setIsOpen(prev => !prev)
  }

  useObserver('CreateGenerativeSkillModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
      <div className={s.skillPromptModal}>
        <SkillDropboxSearch
          list={lmServices?.map(
            (lmService: ILmService) => lmService.display_name
          )}
        />
        <TextArea label='Enter prompt:' />
        <div className={s.btns}>
          <Button theme='secondary' props={{ onClick: handleBackClick }}>
            Back
          </Button>
          <Button theme='primary' props={{ onClick: handleCreateClick }}>
            Create
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
