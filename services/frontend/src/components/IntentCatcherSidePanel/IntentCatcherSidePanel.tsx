import { useEffect, useState } from 'react'
import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import IntentListItem, {
  IntentListItemInterface,
} from '../IntentListItem/IntentListItem'
import IntentList from '../IntentList/IntentList'
import BaseLink from '../BaseLink/BaseLink'
import s from './IntentCatcherSidePanel.module.scss'
import SidePanelStatus from '../SidePanelStatus/SidePanelStatus'
import { nanoid } from 'nanoid'
import ReactTooltip from 'react-tooltip'
import { subscribe, trigger, unsubscribe } from '../../utils/events'

const intentsMock: IntentListItemInterface[] = [
  {
    id: nanoid(8),
    name: 'Want_pizza',
    about: 'want pizza, wanna pizza, love pizza, like pizza...',
    status: 'error',
  },
  {
    id: nanoid(8),
    name: 'Hello',
    about: 'Hey, Hello, Hi',
    status: 'error',
  },
  {
    id: nanoid(8),
    name: 'Yes',
    about: 'yes, yeah, alright, ok',
    status: 'error',
  },
  {
    id: nanoid(8),
    name: 'No',
    about: 'No, Nope, Do not do it',
    status: 'error',
  },
  {
    id: nanoid(8),
    name: 'Help',
    about: 'sos, help, help me',
    status: 'error',
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
  {
    id: nanoid(8),
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
]

const IntentCatcherSidePanel = ({
  position,
  disabled,
}: Partial<SidePanelProps>) => {
  const [isOpen, setIsOpen] = useState(false)
  /* `isTrainingLoading - training loading status` */
  /* `isTraining` - status from start training to Replace IntentCatcher*/
  const [isTrainingLoading, setIsTrainingLoading] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingResponse, setTrainingResponse] = useState<{
    status: 'success' | 'error'
  } | null>(null)

  const handleCloseBtnClick = () => setIsOpen(false)

  const handleAddIntentBtnClick = () => trigger('IntentCatcherModal', {})

  const handleTrainBtnClick = () => {
    setIsTraining(true)
    setIsTrainingLoading(true)
    // Mock timeout
    setTimeout(() => {
      setTrainingResponse({
        status: ['success', 'error'][Math.floor(Math.random() * 2)] as
          | 'success'
          | 'error',
      })
      setIsTrainingLoading(false)
    }, 6000)
  }

  const handleCancelTrainBtnClick = () => {
    setIsTraining(false)
    setIsTrainingLoading(false)
  }

  const handleEventUpdate = (data: { detail: any }) => {
    // Set here Intent Catcher details when opening
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    subscribe('IntentCatcherSidePanel', handleEventUpdate)
    return () => unsubscribe('IntentCatcherSidePanel', handleEventUpdate)
  }, [])

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Intent Catcher'>
      <div className={s.intentCatcherSidePanel}>
        <div className={s.intentCatcherSidePanel__container}>
          <Button
            theme='secondary'
            long
            props={{
              onClick: handleAddIntentBtnClick,
              disabled: isTraining || disabled,
            }}>
            <PlusIcon />
            Add Intent
          </Button>
          <IntentList>
            {intentsMock.map(({ id, name, about, status }, i) => (
              <IntentListItem
                key={id}
                id={id}
                name={name}
                about={about}
                status={status}
                disabled={isTrainingLoading}
              />
            ))}
          </IntentList>
          {!isTraining && !disabled && (
            <Button theme='primary' props={{ onClick: handleTrainBtnClick }}>
              Train
            </Button>
          )}
        </div>

        {/* Training not available yet */}
        {disabled && (
          <SidePanelStatus
            status='default'
            title='Sorry, training is not yet available.'
            desc='Stay tuned for the upcoming updates!'>
            <Button theme='secondary' props={{ onClick: handleCloseBtnClick }}>
              Close
            </Button>
          </SidePanelStatus>
        )}

        {/* Training loading bottom info */}
        {isTrainingLoading && (
          <div className={s.training}>
            <span className={s.training__status}>Training</span>
            <div className={s['training__progress-bar']}></div>
            <p className={s.training__about}>
              This may take 5 minutes — 3 hours, depending on whether you have a
              GPU or not.
            </p>
            <BaseLink to='#' theme='link'>
              See details
            </BaseLink>
            <div className={s.training__btns}>
              <Button
                theme='secondary'
                props={{ onClick: handleCancelTrainBtnClick }}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Training status */}
        {!isTrainingLoading && isTraining && (
          <SidePanelStatus
            status={trainingResponse?.status ?? 'default'}
            title={`Model training has ${
              trainingResponse?.status === 'success' ? 'succeeded' : 'failed'
            }.`}
            desc='Do you want to replace the original Intent Catcher with this
          model?'
            detailsLink='#'>
            <Button
              theme='secondary'
              props={{ onClick: handleCancelTrainBtnClick }}>
              Cancel
            </Button>
            <Button
              theme='primary'
              props={{ disabled: trainingResponse?.status === 'error' }}>
              Replace
            </Button>
          </SidePanelStatus>
        )}
      </div>
    </BaseSidePanel>
  )
}

export default IntentCatcherSidePanel
