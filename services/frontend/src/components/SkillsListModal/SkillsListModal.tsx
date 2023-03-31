import { useState } from 'react'
import BaseModal from '../../ui/BaseModal/BaseModal'
import { Table } from '../../ui/Table/Table'
import { SkillList } from '../SkillList/SkillList'
import { AddButton } from '../../ui/AddButton/AddButton'
import { ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import { useObserver } from '../../hooks/useObserver'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import s from './SkillsListModal.module.scss'

export const SkillsListModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [skills, setSkills] = useState<ISkill[]>()
  const { options } = useDisplay()
  const rightSidepanelIsActive = options.get(consts.RIGHT_SP_IS_ACTIVE)
  const postion = {
    overlay: {
      top: 64,
      zIndex: 2,
      right: rightSidepanelIsActive ? '368px' : 0,
      transition: 'all 0.3s linear',

    },
    content: {
    },
  }

  const handleEventUpdate = (data: any) => {
    data?.detail?.mockSkills && setSkills(data?.detail?.mockSkills)
    setIsOpen(!isOpen)
  }

  const okHandler = () => setIsOpen(!isOpen)

  useObserver('SkillsListModal', handleEventUpdate)

  return (
    <>
      <BaseModal
        skillsListModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        customStyles={postion}>
        <div className={s.container}>
          <div className={s.header}>Choose Skill</div>
          <Table second='Type' addButton={<AddButton forTable fromScratch />}>
            <SkillList skills={skills!} view={'table'} forModal />
          </Table>
          <div className={s.footer}>
            <Button theme='primary' props={{ onClick: okHandler }}>
              OK
            </Button>
          </div>
        </div>
      </BaseModal>
    </>
  )
}
