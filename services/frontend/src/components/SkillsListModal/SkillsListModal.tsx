import classNames from 'classnames/bind'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import { useDisplay } from '../../context/DisplayContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useComponent } from '../../hooks/useComponent'
import { useDeploy } from '../../hooks/useDeploy'
import { useObserver } from '../../hooks/useObserver'
import { toasts } from '../../mapping/toasts'
import { getComponentsGroup } from '../../services/getComponentsGroup'
import { AddButton } from '../../ui/AddButton/AddButton'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Table } from '../../ui/Table/Table'
import { consts } from '../../utils/consts'
import { SkillList } from '../SkillList/SkillList'
import s from './SkillsListModal.module.scss'

export const SkillsListModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { options } = useDisplay()
  const { name: distName } = useParams()
  const { addComponentToDist } = useComponent()
  const { deleteDeployment } = useDeploy()
  const cx = classNames.bind(s)
  const { getDist } = useAssistants()
  const assistant = getDist(distName!)
  const { data: skillsList } = useQuery(
    'skills',
    () => getComponentsGroup('skills?component_type=Generative&author_id=1'),
    {
      enabled: isOpen,
    }
  )
  const rightSidepanelIsActive = options.get(consts.RIGHT_SP_IS_ACTIVE)
  const position = {
    overlay: {
      top: 64,
      zIndex: 2,
      right: rightSidepanelIsActive ? '368px' : 0,
      transition: 'all 0.3s linear',
    },
    content: {
      width: '95%',
    },
  }
  const handleEventUpdate = () => {
    setIsOpen(isOpen => !isOpen)
  }

  const okHandler = () => setIsOpen(prev => !prev)
  const handleAdd = (distName: string, id: number) => {
    const assistantId = assistant?.data?.deployment.id
    toast.promise(
      addComponentToDist.mutateAsync(
        { distName, id, type: 'skills' },
        {
          onSuccess: () => {
            deleteDeployment.mutateAsync(assistantId)
          },
        }
      ),
      toasts.addComponent
    )
  }

  useObserver('SkillsListModal', handleEventUpdate)
  return (
    <>
      {skillsList && (
        <BaseModal
          skillsListModal
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          customStyles={position}
        >
          <div
            className={cx(
              'container',
              rightSidepanelIsActive && 'rightSidepanelIsActive'
            )}
          >
            <div className={s.header}>Choose Skill</div>
            <Table
              second='Type'
              withoutDate={rightSidepanelIsActive}
              addButton={<AddButton forTable fromScratch />}
            >
              <SkillList
                addFunc={handleAdd}
                skills={skillsList}
                view={'table'}
                forModal
                withoutDate={rightSidepanelIsActive}
              />
            </Table>
            <div className={s.footer}>
              <Button theme='primary' props={{ onClick: okHandler }}>
                OK
              </Button>
            </div>
          </div>
        </BaseModal>
      )}
    </>
  )
}
