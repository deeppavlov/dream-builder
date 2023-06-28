import { BotInfoInterface } from 'types/types'
import { DEPLOY_STATUS, PUBLISH_REQUEST_STATUS } from 'constants/constants'

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
  const onModeration = publish_state === PUBLISH_REQUEST_STATUS.IN_REVIEW
  const isDeployed = deployment?.state === DEPLOY_STATUS.UP
  const isDeploying =
    !isDeployed && deployment?.state !== null && deployment !== null

  return { onModeration, isDeployed, isDeploying }
}
