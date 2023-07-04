import { ELOCALES_TITLE, TLocales } from 'types/types'

export const DEBUG_DIST = 'universal_prompted_assistant'
export const DEEPY_ASSISTANT = 'deepy_assistant'
export const DUMMY_SKILL = 'dummy_skill'
export const TOOLTIP_DELAY = 1000
export const OPEN_AI_LM = 'OpenAI'

export const DEPLOY_STATUS = {
  STARTED: 'STARTED',
  CREATING_CONFIG_FILES: 'CREATING_CONFIG_FILES',
  BUILDING_IMAGE: 'BUILDING_IMAGE',
  PUSHING_IMAGES: 'PUSHING_IMAGES',
  DEPLOYING_STAC: 'DEPLOYING_STACK',
  DEPLOYED: 'DEPLOYED',
  UP: 'UP',
}
export const VISIBILITY_STATUS = {
  PRIVATE: 'PRIVATE',
  UNLISTED_LINK: 'UNLISTED_LINK',
  PUBLIC_TEMPLATE: 'PUBLIC_TEMPLATE',
}
export const PUBLISH_REQUEST_STATUS = {
  IN_REVIEW: 'IN_REVIEW',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
}
export const INTEGRATION_ACTIVE_TAB = {
  CHAT: 'CHAT',
  API: 'API',
}
export const API_CALL_TAB = {
  CURL: 'CURL',
  NODE: 'NODE',
  PYTHON: 'PYTHON',
}
// TODO rename & implement everywhere
export const PUBLIC_DISTS = 'publicDists'
export const PRIVATE_DISTS = 'privateDists'
export const DIST = 'dist'

export const I18N_STORE_KEY = 'i18nextLng'

export const locales: TLocales = {
  en: { title: ELOCALES_TITLE.EN },
  ru: { title: ELOCALES_TITLE.RU },
}
