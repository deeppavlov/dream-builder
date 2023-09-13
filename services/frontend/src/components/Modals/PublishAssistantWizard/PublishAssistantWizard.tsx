import { ReactNode, useState } from 'react'
import toast from 'react-hot-toast'
import store from 'store2'
import {
  BotInfoInterface,
  TDeploymentState,
  TDistVisibility,
} from 'types/types'
import { HIDE_PUBLISH_ALERT_KEY, VISIBILITY_STATUS } from 'constants/constants'
import { toasts } from 'mapping/toasts'
import { useAssistants } from 'hooks/api'
import { useObserver } from 'hooks/useObserver'
import { BaseModal } from 'components/Modals'
import { AddEmailModule } from './AddEmailModule/AddEmailModule'
import { WarningModule } from './WarningModule/WarningModule'

export const PublishAssistantWizard = () => {
  const [bot, setBot] = useState<BotInfoInterface>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [inEditor, setInEditor] = useState<boolean>(false)
  const [deploymentState, setDeploymentState] = useState<TDeploymentState>()
  const [step, setStep] = useState(0)
  const { changeVisibility } = useAssistants()
  const hasEmail = Boolean(store('user').email)

  const handleContinue = () => {
    hasEmail ? handlePublish() : setStep(prev => prev + 1)
  }

  const handleEventUpdate = (data: any) => {
    setBot(data.detail.bot)
    setInEditor(data.detail.inEditor)
    setDeploymentState(data.detail.deploymentState)
    setIsOpen(prev => !prev)

    const hidePublishAlert = store(HIDE_PUBLISH_ALERT_KEY)
    setStep(Number(hidePublishAlert) || 0)
  }

  const handleCancel = () => {
    setIsOpen(prev => !prev)
    setStep(0)
  }

  const handlePublish = () => {
    const name = bot?.name!
    const newVisibility = VISIBILITY_STATUS.PUBLIC_TEMPLATE as TDistVisibility
    setIsOpen(false)
    toast.promise(
      changeVisibility.mutateAsync({
        name,
        newVisibility,
        inEditor,
        deploymentState,
      }),
      toasts().publishAssistant
    )
  }

  useObserver('PublishAssistantWizard', handleEventUpdate)

  const steps: { [key: number]: ReactNode } = {
    0: <WarningModule onClose={handleCancel} onContinue={handleContinue} />,
    1: <AddEmailModule onClose={handleCancel} onContinue={handlePublish} />,
  }
  return (
    <>
      <BaseModal isOpen={isOpen} setIsOpen={setIsOpen}>
        {steps[step]}
      </BaseModal>
    </>
  )
}
