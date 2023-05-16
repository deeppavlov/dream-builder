import classNames from 'classnames/bind'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router'
import { useDisplay } from '../../context/DisplayContext'
import { useAssistants } from '../../hooks/useAssistants'
import { useComponent } from '../../hooks/useComponent'
import { useDeploy } from '../../hooks/useDeploy'
import { useObserver } from '../../hooks/useObserver'
import { toasts } from '../../mapping/toasts'
import { AddButton } from '../../ui/AddButton/AddButton'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import { Table } from '../../ui/Table/Table'
import { consts } from '../../utils/consts'
import { trigger } from '../../utils/events'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { SkillList } from '../SkillList/SkillList'
import s from './SkillsListModal.module.scss'

interface IAddPublicSkill {
  display_name: string
  description: string
}

export const SkillsListModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { options } = useDisplay()
  const { name: distName } = useParams()
  const { deleteDeployment } = useDeploy()
  const { getDist, changeVisibility } = useAssistants()
  const { getGroupComponents, create } = useComponent()
  const assistant = getDist(distName!)
  const { data: skillsList } = getGroupComponents(
    {
      distName: distName || '',
      group: 'skills',
      component_type: 'Generative',
      author_id: 1,
    },
    { enabled: isOpen }
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
  const cx = classNames.bind(s)

  const handleClose = () => {
    setIsOpen(false)
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }

  const handleEventUpdate = () => setIsOpen(true)

  const handleOk = () => setIsOpen(prev => !prev)

  const handleAdd = (data: IAddPublicSkill) => {
    const assistantId = assistant?.data?.deployment?.id!

    toast.promise(
      create.mutateAsync(
        { data, distName: distName || '', type: 'skills' },
        {
          onSuccess: () => {
            assistant?.data?.deployment?.state === 'UP' &&
              deleteDeployment.mutateAsync(assistantId).then(() => {
                // unpublish
                const name = assistant?.data?.name!
                const visibility = 'private'

                assistant?.data?.publish_state !== null &&
                  changeVisibility.mutateAsync({ name, visibility }) //FIX
              })
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
          handleClose={handleClose}
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
                handleAdd={handleAdd}
                skills={skillsList}
                view={'table'}
                forModal
                type='public'
                withoutDate={rightSidepanelIsActive}
              />
            </Table>
            <div className={s.footer}>
              <Button theme='primary' props={{ onClick: handleOk }}>
                OK
              </Button>
            </div>
          </div>
        </BaseModal>
      )}
    </>
  )
}
