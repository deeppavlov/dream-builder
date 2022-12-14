import { useState } from 'react'
import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import IntentList from '../IntentList/IntentList'
import IntentListItem, {
  IntentListItemInterface,
} from '../IntentListItem/IntentListItem'
import s from './IntentResponderSidePanel.module.scss'
import { nanoid } from 'nanoid'

export const intentsMock: IntentListItemInterface[] = [
  {
    id: nanoid(8),
    name: 'Exit',
    about: 'Bye-bye!',
    status: 'error',
  },
  {
    id: nanoid(8),
    name: 'Exit',
    about: 'Bye-bye!',
    status: 'success',
  },
  {
    id: nanoid(8),
    name: "what_time | don't_understand",
    about: 'Sorry, I might sound confusing, I am still ...',
    status: 'success',
  },
  {
    id: nanoid(8),
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    id: nanoid(8),
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    id: nanoid(8),
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    id: nanoid(8),
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
]

const IntentResponderSidePanel = ({
  isOpen,
  setIsOpen,
  position,
}: SidePanelProps) => {
  const [addModalIsOpen, setAddModalIsOpen] = useState(false)

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Intent Responder'>
      <div className={s.intentResponder}>
        <Button theme='secondary' long>
          <PlusIcon />
          Add Intent Responder
        </Button>
        <IntentList>
          <Accordeon title='User-customized' small>
            {intentsMock.map(({ id, name, about, status }) => (
              <IntentListItem
                key={id}
                id={id}
                name={name}
                about={about}
                status={status}
              />
            ))}
          </Accordeon>
          <Accordeon title='Prebuilt' small>
            {intentsMock.map(({ id, name, about }) => (
              <IntentListItem
                key={id}
                id={id}
                name={name}
                about={about}
                status='default'
              />
            ))}
          </Accordeon>
        </IntentList>
        <div className={s.attention}>
          <span className={s.attention__name}>Attention!</span>
          <p className={s.attention__desc}>
            Instructions:
            <br />
            Now you can add special answers for your Intents, if you want to
            make them high Priority
          </p>
        </div>
        <div className={s.intentResponder__btns}>
          <Button theme='primary'>Save</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default IntentResponderSidePanel
