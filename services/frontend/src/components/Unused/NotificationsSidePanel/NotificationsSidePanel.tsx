import { useState } from 'react'
import { ReactComponent as Close } from 'assets/icons/close.svg'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { SidePanelHeader } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import NotificationCard, {
  NotificationCardProps,
} from 'components/Unused/NotificationCard/NotificationCard'
import s from './NotificationsSidePanel.module.scss'

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

const NotificationsSidePanel = () => {
  const [noteIsOpen, setNoteIsOpen] = useState(true)
  const handleCloseBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

  return (
    <>
      <SidePanelHeader>Notifications</SidePanelHeader>
      <div className={s.notificationsSidePanel}>
        <div className={`${s.note} ${!noteIsOpen ? s.note_hidden : ''}`}>
          <span className={s.note__name}>Please note:</span> if the score shows{' '}
          <b>training...</b> , your Virtual Assistant will use the last training
          status.
          <button
            onClick={() => setNoteIsOpen(false)}
            className={s.note__close}
          >
            <Close />
          </button>
        </div>
        <div className={s.notificationsSidePanel__list}>
          {notificMock.map(({ topic, type, about, status, statusCount }, i) => (
            <NotificationCard
              key={topic + i}
              topic={topic}
              type={type}
              about={about}
              status={status}
              statusCount={statusCount}
            />
          ))}
        </div>
        <div className={s.notificationsSidePanel__btns}>
          <Button theme='secondary' props={{ onClick: handleCloseBtnClick }}>
            Close
          </Button>
        </div>
      </div>
    </>
  )
}

export default NotificationsSidePanel
