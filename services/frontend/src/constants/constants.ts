export const DEBUG_DIST = 'universal_prompted_assistant'
export const DEEPY_ASSISTANT = 'deepy_assistant'
export const TOOLTIP_DELAY = 1000
export const OPEN_AI_LM = 'OpenAI'

export enum DeployInProgress {
  'STARTED',
  'CREATING_CONFIG_FILES',
  'PUSHING_IMAGES',
  'DEPLOYED',
}
export const VisibilityStatus = {
  PRIVATE: 'PRIVATE',
  UNLISTED_LINK: 'UNLISTED_LINK',
  PUBLIC_TEMPLATE: 'PUBLIC_TEMPLATE',
}
export const PublishRequestsStatus = {
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}
