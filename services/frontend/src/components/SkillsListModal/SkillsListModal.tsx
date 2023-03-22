import { useEffect, useState } from 'react'
import classNames from 'classnames/bind'
import { subscribe, unsubscribe } from '../../utils/events'
import BaseModal from '../../ui/BaseModal/BaseModal'
import { Table } from '../../ui/Table/Table'
import { SkillList } from '../SkillList/SkillList'
import { AddButton } from '../../ui/AddButton/AddButton'
import { ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import s from './SkillsListModal.module.scss'

export const SkillsListModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [skills, setSkills] = useState<ISkill[]>()

  const cx = classNames.bind(s)

  const handleEventUpdate = (data: any) => {
    setIsOpen(!isOpen)
    
    data?.detail?.mockSkills && setSkills(data?.detail?.mockSkills)
  }
  const okHandler = () => {
    setIsOpen(!isOpen)
  }
  useEffect(() => {
    subscribe('SkillsListModal', handleEventUpdate)
    return () => unsubscribe('SkillsListModal', handleEventUpdate)
  }, [])

  return (
    <>
      <BaseModal skillsListModal isOpen={isOpen} setIsOpen={setIsOpen}>
        <div className={s.container}>
          <div className={s.header}>
            <p>Choose Skill</p>
          </div>
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
