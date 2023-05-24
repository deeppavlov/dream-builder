import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { useState } from 'react'
import Button from '../../ui/Button/Button'
import SidePanelStatus from '../../ui/SidePanelStatus/SidePanelStatus'
import { trigger } from '../../utils/events'
import AnnotatorSidePanel from '../AnnotatorSidePanel/AnnotatorSidePanel'
import BaseLink from '../BaseLink/BaseLink'
import { TRIGGER_RIGHT_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import IntentList from '../IntentList/IntentList'
import IntentListItem, {
  IntentListItemInterface,
} from '../IntentListItem/IntentListItem'
import s from './IntentCatcherSidePanel.module.scss'

const intentsMock: IntentListItemInterface[] = [
  {
    id: '1',
    name: 'Want_pizza',
    about: 'want pizza, wanna pizza, love pizza, like pizza...',
    status: 'error',
  },
  {
    id: '1',
    name: 'Hello',
    about: 'Hey, Hello, Hi',
    status: 'error',
  },
  {
    id: '1',
    name: 'Yes',
    about: 'yes, yeah, alright, ok',
    status: 'error',
  },
  {
    id: '1',
    name: 'No',
    about: 'No, Nope, Do not do it',
    status: 'error',
  },
  {
    id: '1',
    name: 'Help',
    about: 'sos, help, help me',
    status: 'error',
  },
  {
    id: '1',
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    id: '1',
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    id: '1',
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    id: '1',
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    id: '1',
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    id: '1',
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    id: '1',
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    id: '1',
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    id: '1',
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    id: '1',
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    id: '1',
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    id: '1',
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
]

interface Props {
  annotator: Annotator
  disabled?: boolean
  activeTab?: 'Properties' | 'Editor'
}

const IntentCatcherSidePanel = ({ annotator, activeTab, disabled }: Props) => {
  /* `isTrainingLoading - training loading status` */
  /* `isTraining` - status from start training to Replace IntentCatcher*/
  const [isTrainingLoading, setIsTrainingLoading] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingResponse, setTrainingResponse] = useState<{
    status: 'success' | 'error'
  } | null>(null)

  const handleCloseBtnClick = () =>
    trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })

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

  return (
    <AnnotatorSidePanel annotator={annotator} activeTab={activeTab}>
      <div className={s.intentCatcherSidePanel}>
        <div className={s.intentCatcherSidePanel__container}>
          <div className={s.name}>Intent Catcher</div>
          <Button
            theme='secondary'
            long
            props={{
              onClick: handleAddIntentBtnClick,
              disabled: isTraining || disabled,
            }}
          >
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
            desc='Stay tuned for the upcoming updates!'
          >
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
                props={{ onClick: handleCancelTrainBtnClick }}
              >
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
            detailsLink='#'
          >
            <Button
              theme='secondary'
              props={{ onClick: handleCancelTrainBtnClick }}
            >
              Cancel
            </Button>
            <Button
              theme='primary'
              props={{ disabled: trainingResponse?.status === 'error' }}
            >
              Replace
            </Button>
          </SidePanelStatus>
        )}
      </div>
    </AnnotatorSidePanel>
  )
}

export default IntentCatcherSidePanel
