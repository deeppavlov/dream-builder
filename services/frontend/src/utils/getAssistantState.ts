import { PublishRequestsStatus } from '../constants/constants'
import { BotInfoInterface } from '../types/types'

interface IResult {
  onModeration: boolean
  isDeployed: boolean
  isDeploying: boolean
}

export const getAssistantState = (
  assistant: BotInfoInterface | undefined
): IResult => {
  if (!assistant)
    return { onModeration: false, isDeployed: false, isDeploying: false }
  const { deployment, publish_state } = assistant
  const onModeration = publish_state === PublishRequestsStatus.IN_REVIEW
  const isDeployed = deployment?.state === 'UP' //FIX
  const isDeploying =
    !isDeployed && deployment?.state !== null && deployment !== null

  return { onModeration, isDeployed, isDeploying }
}
