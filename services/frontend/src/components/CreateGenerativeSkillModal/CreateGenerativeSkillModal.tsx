import { useState } from 'react'
import { useQuery } from 'react-query'
import { useObserver } from '../../hooks/useObserver'
import { getAllLMservices } from '../../services/getAllLMservices'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { TextArea } from '../../ui/TextArea/TextArea'
import { trigger } from '../../utils/events'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
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

  const handleCreateClick = () => {
    
    
  }

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
