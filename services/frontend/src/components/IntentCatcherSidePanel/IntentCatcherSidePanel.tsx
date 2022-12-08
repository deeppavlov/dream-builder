import { useState } from 'react'
import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import IntentListItem, {
  IntentListItemProps,
} from '../IntentListItem/IntentListItem'
import IntentList from '../IntentList/IntentList'
import IntentModal from '../IntentModal/IntentModal'
import BaseLink from '../BaseLink/BaseLink'
import s from './IntentCatcherSidePanel.module.scss'

const intentsMock: IntentListItemProps[] = [
  {
    name: 'Want_pizza',
    about: 'want pizza, wanna pizza, love pizza, like pizza...',
    status: 'error',
  },
  {
    name: 'Hello',
    about: 'Hey, Hello, Hi',
    status: 'error',
  },
  {
    name: 'Yes',
    about: 'yes, yeah, alright, ok',
    status: 'error',
  },
  {
    name: 'No',
    about: 'No, Nope, Do not do it',
    status: 'error',
  },
  {
    name: 'Help',
    about: 'sos, help, help me',
    status: 'error',
  },
  {
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
  {
    name: 'Stop',
    about: 'stop, stop it, let it stop',
    status: 'warning',
  },
  {
    name: 'Cancel',
    about: 'Cancel, cancel it',
    status: 'warning',
  },
  {
    name: 'Fallback',
    about: 'Fallback',
    status: 'success',
  },
  {
    name: 'Bye',
    about: 'Bye, See you, Goodbye, See ya',
    status: 'success',
  },
]

const IntentCatcherSidePanel = ({
  isOpen,
  setIsOpen,
  position,
}: SidePanelProps) => {
  /* `isTrainingLoading - training loading status` */
  /* `isTraining` - status from start training to Replace IntentCatcher*/
  const [isTrainingLoading, setIsTrainingLoading] = useState(false)
  const [isTraining, setIsTraining] = useState(false)
  const [trainingResponse, setTrainingResponse] = useState<{
    status: 'success' | 'failed'
  } | null>(null)
  const [addModalIsOpen, setAddModalIsOpen] = useState(false)
  const handleAddIntentBtnClick = () => setAddModalIsOpen(true)
  const handleTrainBtnClick = () => {
    setIsTraining(true)
    setIsTrainingLoading(true)
    // Mock timeout
    setTimeout(() => {
      setTrainingResponse({
        status: ['success', 'failed'][Math.floor(Math.random() * 2)] as
          | 'success'
          | 'failed',
      })
      setIsTrainingLoading(false)
    }, 6000)
  }
  const handleCancelTrainBtnClick = () => {
    setIsTraining(false)
    setIsTrainingLoading(false)
  }

  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='Intent Catcher'>
      <div className={s.intentCatcherSidePanel}>
        <div
          className={`${s.intentCatcherSidePanel__container} ${
            !isTrainingLoading &&
            isTraining &&
            s.intentCatcherSidePanel__container_muted
          }`}>
          <Button
            theme='secondary'
            long
            props={{
              onClick: handleAddIntentBtnClick,
              disabled: isTraining,
            }}>
            <PlusIcon />
            Add Intent
          </Button>
          <IntentList>
            {intentsMock.map(({ name, about, status }, i) => (
              <IntentListItem
                key={name + i}
                name={name}
                about={about}
                status={status}
                disabled={isTrainingLoading}
              />
            ))}
          </IntentList>
          {!isTraining && (
            <Button theme='primary' props={{ onClick: handleTrainBtnClick }}>
              Train
            </Button>
          )}
        </div>

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
        {!isTrainingLoading && isTraining && (
          <div
            className={`${s.trainingResponse} ${
              s[`trainingResponse_${trainingResponse?.status}`]
            }`}>
            <div className={s.trainingResponse__status}>
              Model training has{' '}
              {trainingResponse?.status === 'success' ? 'succeeded' : 'failed'}.
              <BaseLink to='#' theme='link'>
                See details
              </BaseLink>
            </div>
            <p className={s.trainingResponse__about}>
              Do you want to replace the original Intent Catcher with this
              model?
            </p>
            <div className={s.trainingResponse__btns}>
              <Button
                theme='secondary'
                props={{ onClick: handleCancelTrainBtnClick }}>
                Cancel
              </Button>
              <Button
                theme='primary'
                props={{ disabled: trainingResponse?.status === 'failed' }}>
                Replace
              </Button>
            </div>
          </div>
        )}

        {/* Maybe need to organize here Edit/Add intent modals */}
        {/* Add new intent Modal */}
        <IntentModal isOpen={addModalIsOpen} setIsOpen={setAddModalIsOpen} />
      </div>
    </BaseSidePanel>
  )
}

export default IntentCatcherSidePanel
