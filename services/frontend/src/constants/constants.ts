import i18n from 'i18n'
import {
  ELOCALES_KEY,
  ELOCALES_TITLE,
  TDeploymentState,
  TDistVisibility,
  TLocales,
} from 'types/types'

export const DEBUG_EN_DIST = 'universal_prompted_assistant'
export const DEBUG_RU_DIST = 'universal_ru_prompted_assistant'
export const DEEPY_ASSISTANT = 'deepy_assistant'
export const DUMMY_SKILL = 'dummy_skill'
export const TOOLTIP_DELAY = 1000
export const OPEN_AI_LM = 'OpenAI'

export const DEPLOY_STATUS: { [key: string]: TDeploymentState } = {
  STARTED: 'STARTED',
  CREATING_CONFIG_FILES: 'CREATING_CONFIG_FILES',
  BUILDING_IMAGE: 'BUILDING_IMAGE',
  PUSHING_IMAGES: 'PUSHING_IMAGES',
  DEPLOYING_STAC: 'DEPLOYING_STACK',
  DEPLOYED: 'DEPLOYED',
  UP: 'UP',
}
export const VISIBILITY_STATUS: { [key: string]: TDistVisibility } = {
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

// TODO rename & implement everywhere
export const PUBLIC_DISTS = 'publicDists'
export const PRIVATE_DISTS = 'privateDists'
export const DIST = 'dist'

export const I18N_STORE_KEY = 'i18nextLng'
export const HIDE_PUBLISH_ALERT_KEY = 'hidePublishAlert'

export const locales: TLocales = {
  en: { title: ELOCALES_TITLE.EN },
  ru: { title: ELOCALES_TITLE.RU },
}
export const language = () => ({
  [ELOCALES_KEY.en]: i18n.t('language.en'),
  [ELOCALES_KEY.ru]: i18n.t('language.ru'),
})
