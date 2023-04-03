import classNames from 'classnames/bind'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { useDisplay } from '../../context/DisplayContext'
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
  const { data: skillsList } = useQuery(
    'skills',
    () => getComponentsGroup('skills'),
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
    content: { width: '95%',height:'95%' },
  }
  const handleEventUpdate = () => {
    setIsOpen(!isOpen)
  }

  const okHandler = () => setIsOpen(!isOpen)

  useObserver('SkillsListModal', handleEventUpdate)
  const cx = classNames.bind(s)
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
