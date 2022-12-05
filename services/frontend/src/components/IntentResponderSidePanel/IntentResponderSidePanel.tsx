import { useState } from 'react'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import IntentListItem, {
  IntentListItemProps,
} from '../IntentListItem/IntentListItem'
import s from './IntentResponderSidePanel.module.scss'

interface props {
  isOpen: boolean
  setIsOpen: (state: boolean) => void
  positions?: Partial<{
    top: number
    left: number
    right: number
    bottom: number
  }>
}

const intentsMock: IntentListItemProps[] = [
  {
    name: 'Want_pizza',
    similar: 'want pizza, wanna pizza, love pizza, like pizza...',
    status: 'error',
  },
  {
    name: 'Hello',
    similar: 'Hey, Hello, Hi',
    status: 'error',
  },
  {
    name: 'Yes',
    similar: 'yes, yeah, alright, ok',
    status: 'error',
  },
  {
    name: 'No',
    similar: 'No, Nope, Do not do it',
    status: 'error',
  },
  {
    name: 'Help',
    similar: 'sos, help, help me',
    status: 'error',
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
    status: 'good',
  },
  {
    name: 'Bye',
    similar: 'Bye, See you, Goodbye, See ya',
    status: 'good',
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
    status: 'good',
  },
  {
    name: 'Bye',
    similar: 'Bye, See you, Goodbye, See ya',
    status: 'good',
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
    status: 'good',
  },
  {
    name: 'Bye',
    similar: 'Bye, See you, Goodbye, See ya',
    status: 'good',
  },
]

const IntentResponderSidePanel = ({ isOpen, setIsOpen, positions }: props) => {
  const [addModalIsOpen, setAddModalIsOpen] = useState(false)

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={positions}
      name='Intent Responder'>Lol</BaseSidePanel>
  )
}

export default IntentResponderSidePanel
