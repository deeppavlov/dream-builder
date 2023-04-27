import classNames from 'classnames/bind'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { useDisplay } from '../../context/DisplayContext'
import { useComponent } from '../../hooks/useComponent'
import { useObserver } from '../../hooks/useObserver'
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
  const { addSkill } = useComponent()
  const cx = classNames.bind(s)
  const { data: skillsList } = useQuery(
    'skills',
    () => getComponentsGroup('skills?component_type=Generative'),
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
    toast.promise(addSkill.mutateAsync({ distName, id }), {
      loading: 'Adding...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
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
