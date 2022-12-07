import React, { useState } from 'react'
import BaseLink from '../../components/BaseLink/BaseLink'
import BaseSidePanel from '../../components/BaseSidePanel/BaseSidePanel'
import DialogSidePanel from '../../components/DialogSidePanel/DialogSidePanel'
import IntentCatcherSidePanel from '../../components/IntentCatcherSidePanel/IntentCatcherSidePanel'
import IntentList from '../../components/IntentList/IntentList'
import IntentListItem, {
  IntentListItemProps,
} from '../../components/IntentListItem/IntentListItem'
import IntentModal from '../../components/IntentModal/IntentModal'
import IntentResponderSidePanel from '../../components/IntentResponderSidePanel/IntentResponderSidePanel'
import { AddSkillModal } from '../../components/ModalWindows/AddSkillModal'
import { CreateAssistantModal } from '../../components/ModalWindows/CreateAssistantModal'
import { EditModal } from '../../components/ModalWindows/EditModal'
import NotificationCard, {
  NotificationCardProps,
} from '../../components/NotificationCard/NotificationCard'
import NotificationsSidePanel from '../../components/NotificationsSidePanel/NotificationsSidePanel'
// import ResourcesSidePanel from '../../components/ResourcesSidePanel/ResourcesSidePanel'
import SmallTag from '../../components/SmallTag/SmallTag'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import Button from '../../ui/Button/Button'
import SidePanel from '../../ui/SidePanel/SidePanel'
import s from './TestPage.module.scss'

const notificMock: NotificationCardProps[] = [
  {
    topic: 'Skills',
    type: 'skill',
    about: 'DFF Intent Responder Skill',
    status: 'success',
  },
  {
    topic: 'Annotators',
    type: 'annotator',
    about: 'Intent Catcher',
    status: 'success',
    statusCount: 5,
  },
  {
    topic: 'Annotators',
    type: 'annotator',
    about: 'Intent Catcher',
    status: 'training',
  },
  {
    topic: 'Annotators',
    type: 'annotator',
    about: 'Intent Catcher',
    status: 'error',
  },
]

const intentItemsMock: IntentListItemProps[] = [
  {
    name: 'Yes',
    similar: 'yes, yeah, alright, ok',
  },
  {
    name: 'Want_pizza',
    similar: 'want pizza, wanna pizza, love pizza, like pizza...',
    status: 'error',
  },
  {
    name: "what_time | don't_understand Sorry, I might sound confusing, I am still ...",
    similar: 'Sorry, I might sound confusing, I am still ...',
    status: 'warning',
  },
  {
    name: 'Fallback',
    similar: 'Fallback',
    status: 'success',
  },
  {
    name: 'Fallback',
    similar: 'Fallback',
    disabled: true,
  },
]

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
        <div className={s.testPage__component}>
          <span>NotificationsSidePanel</span>
          {getBtnWithModal(NotificationsSidePanel, 'Notifications')}
        </div>
        {/* <div className={s.testPage__component}>
          <span>ResourcesSidePanel</span>
          {getBtnWithModal(ResourcesSidePanel, 'Resources')}
        </div> */}
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
        <Button theme='secondary' long>
          Secondary Large Long
        </Button>
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
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>IntentListItem</span>
        {intentItemsMock.map(({ name, similar, disabled, status }, i) => (
          <div className={s.testPage__component} key={name + i}>
            <span>{disabled ? 'disabled' : status ?? 'default'}</span>
            <IntentListItem
              name={name}
              similar={similar}
              disabled={disabled}
              status={status}
            />
          </div>
        ))}
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>IntentList</span>
        <IntentList>
          {intentItemsMock.map(({ name, similar, disabled, status }, i) => (
            <IntentListItem
              key={name + i}
              name={name}
              similar={similar}
              disabled={disabled}
              status={status}
            />
          ))}
        </IntentList>
      </div>
      <div className={s.testPage__component}>
        <span className={s['testPage__block-name']}>SmallTag</span>
        <SmallTag>default</SmallTag>
        <SmallTag theme='version'>v0.2.3</SmallTag>
        <SmallTag theme='success'>success</SmallTag>
        <SmallTag isLoading>training</SmallTag>
        <SmallTag theme='error'>error</SmallTag>
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>NotificationCard</span>
        {notificMock.map(({ topic, type, about, status, statusCount }, i) => (
          <div key={topic + i} className={s.testPage__component}>
            <span>{statusCount ? 'with count' : status}</span>
            <NotificationCard
              topic={topic}
              type={type}
              about={about}
              status={status}
              statusCount={statusCount}
            />
          </div>
        ))}
      </div>
      <div className={s.testPage__block}>
        <span className={s['testPage__block-name']}>Accordeon</span>
        <div className={s.testPage__component}>
          <span>default</span>
          <Accordeon title='Lorem ipsum is placeholder text commonly'>
            <p>
              Lorem ipsum is placeholder text commonly used in the graphic,
              print, and publishing industries for previewing layouts and visual
              mockups
            </p>
          </Accordeon>
        </div>
      </div>
      <div className={s.testPage__component}>
        <span>small</span>
        <Accordeon title='Lorem ipsum is placeholder text commonly' small>
          <p>
            Lorem ipsum is placeholder text commonly used in the graphic, print,
            and publishing industries for previewing layouts and visual mockups
          </p>
        </Accordeon>
      </div>
    </div>
  )
}
