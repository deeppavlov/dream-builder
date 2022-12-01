import React, { useState } from 'react'
import IntentModal from '../../components/IntentModal/IntentModal'
import { AddSkillModal } from '../../components/ModalWindows/AddSkillModal'
import { CreateAssistantModal } from '../../components/ModalWindows/CreateAssistantModal'
import { EditModal } from '../../components/ModalWindows/EditModal'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import s from './TestPage.module.scss';

export const TestPage = () => {
  const getButtonWithModal = (
    ModalEl: React.FC<{ isOpen: boolean; setIsOpen: Function }>,
    btnLabel: string
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <button className={s.modalBtn} onClick={() => setIsOpen(true)}>{btnLabel}</button>
        <ModalEl isOpen={isOpen} setIsOpen={setIsOpen} />
      </>
    )
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'lightgray',
        height: '100%',
        gap: '40px',
      }}>
      <CreateAssistantModal>Create Assistant</CreateAssistantModal>
      <AddSkillModal>Add Skill</AddSkillModal>
      <EditModal>Edit Bot Description</EditModal>
      {getButtonWithModal(IntentModal, 'Add / Edit Intent')}
      <CheckBox />
    </div>
  )
}
