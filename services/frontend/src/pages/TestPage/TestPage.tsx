import React, { useState } from 'react'
import BaseLink from '../../components/BaseLink/BaseLink'
import BaseSidePanel from '../../components/BaseSidePanel/BaseSidePanel'
import DialogSidePanel from '../../components/DialogSidePanel/DialogSidePanel'
import IntentCatcherSidePanel from '../../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import IntentModal from '../../components/IntentModal/IntentModal'
import IntentResponderSidePanel from '../../components/IntentResponderSidePanel/IntentResponderSidePanel'
import { AddSkillModal } from '../../components/ModalWindows/AddSkillModal'
import { CreateAssistantModal } from '../../components/ModalWindows/CreateAssistantModal'
import { EditModal } from '../../components/ModalWindows/EditModal'
import Button from '../../ui/Button/Button'
import SidePanel from '../../ui/SidePanel/SidePanel'
import s from './TestPage.module.scss'

export const TestPage = () => {
  const getBtnWithModal = (
    ComponentEl: React.FC<{
      isOpen: boolean
      setIsOpen: (state: boolean) => void
    }>,
    btnLabel: string,
    props?: React.PropsWithoutRef<any>
  ) => {
    const [isOpen, setIsOpen] = useState(false)
    return (
      <>
        <Button theme='primary' props={{ onClick: () => setIsOpen(true) }}>
          {btnLabel}
        </Button>
        <ComponentEl isOpen={isOpen} setIsOpen={setIsOpen} {...props} />
      </>
    )
  }

  return (
    <div className={s.testPage}>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Modals</span>
        <CreateAssistantModal>Create Assistant</CreateAssistantModal>
        <AddSkillModal>Add Skill</AddSkillModal>
        <EditModal>Edit Bot Description</EditModal>
        <div className={s.testPage__component}>
          <span>IntentCatcherModal</span>
          {getBtnWithModal(IntentModal, 'Add Intent')}
          {getBtnWithModal(IntentModal, 'Edit Intent')}
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>SidePanels</span>
        {getBtnWithModal(SidePanel, 'default empty (ui-kit)', {
          children: <>default empty sidepanel (ui-kit)</>,
        })}
        {getBtnWithModal(BaseSidePanel, 'default (dream builder)')}
        <div className={s.testPage__component}>
          <span>DialogSidePanel</span>
          {getBtnWithModal(DialogSidePanel, 'Dialog (start)', { start: true })}
          {getBtnWithModal(DialogSidePanel, 'Dialog (chatting)')}
          {getBtnWithModal(DialogSidePanel, 'Dialog (error)', { error: true })}
        </div>
        <div className={s.testPage__component}>
          <span>IntentCatcherSidePanel</span>
          {getBtnWithModal(IntentCatcherSidePanel, 'Intent Catcher')}
        </div>
        <div className={s.testPage__component}>
          <span>IntentResponderSidePanel</span>
          {getBtnWithModal(IntentResponderSidePanel, 'Intent Responder')}
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Buttons</span>
        <div className={s.testPage__component}>
          <span>Regular</span>
          <Button theme='primary'>Regular Large</Button>
          <Button theme='primary' props={{ disabled: true }}>
            Regular Large (disabled)
          </Button>
          <Button theme='primary' small>
            Regular Small
          </Button>
          <Button theme='primary' small props={{ disabled: true }}>
            Regular Small (disabled)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>Secondary</span>
          <Button theme='secondary'>Secondary Large</Button>
          <Button theme='secondary' props={{ disabled: true }}>
            Secondary Large (disabled)
          </Button>
          <Button theme='secondary' small>
            Secondary Small
          </Button>
          <Button theme='secondary' small props={{ disabled: true }}>
            Secondary Small (disabled)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>Tertiary</span>
          <Button theme='tertiary'>Tertiary Large</Button>
          <Button theme='tertiary' props={{ disabled: true }}>
            Tertiary Large (disabled)
          </Button>
          <Button theme='tertiary' small>
            Tertiary Small
          </Button>
          <Button theme='tertiary' small props={{ disabled: true }}>
            Tertiary Small (disabled)
          </Button>
        </div>
        <div className={s.testPage__component}>
          <span>Ghost</span>
          <Button theme='ghost'>Ghost button</Button>
          <Button theme='ghost' props={{ disabled: true }}>
            Ghost button
          </Button>
        </div>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Links</span>
        <div className={s.testPage__component}>
          <span>Link1 (expand)</span>
          <BaseLink to='#' theme='expand'>
            Link
          </BaseLink>
          <BaseLink to='#' theme='expand' disabled>
            Link
          </BaseLink>
        </div>
        <div className={s.testPage__component}>
          <span>Link2 (link)</span>
          <BaseLink to='#' theme='link'>
            Link
          </BaseLink>
          <BaseLink to='#' theme='link' disabled>
            Link
          </BaseLink>
        </div>
      </div>
    </div>
  )
}
