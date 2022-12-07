import { useState } from 'react'
import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import IntentList from '../IntentList/IntentList'
import IntentListItem, {
  IntentListItemProps,
} from '../IntentListItem/IntentListItem'
import s from './IntentResponderSidePanel.module.scss'

const intentsMock: IntentListItemProps[] = [
  {
    name: 'Exit',
    similar: 'Bye-bye!',
    status: 'error',
  },
  {
    name: 'Exit',
    similar: 'Bye-bye!',
    status: 'success',
  },
  {
    name: "what_time | don't_understand",
    similar: 'Sorry, I might sound confusing, I am still ...',
    status: 'success',
  },
  {
    name: 'Bye',
    similar: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    name: 'Stop',
    similar: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    name: 'Cancel',
    similar: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    name: 'Fallback',
    similar: 'Fallback',
    status: 'success',
  },
]

const IntentResponderSidePanel = ({ isOpen, setIsOpen, position }: SidePanelProps) => {
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
            {intentsMock.map(({ name, similar, status }, i) => (
              <IntentListItem
                key={name + i}
                name={name}
                similar={similar}
                status={status}
              />
            ))}
          </Accordeon>
          <Accordeon title='Prebuilt' small>
            {intentsMock.map(({ name, similar }, i) => (
              <IntentListItem key={name + i} name={name} similar={similar} />
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
