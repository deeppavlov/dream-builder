import i18n from 'i18n'
import { VISIBILITY_STATUS } from '../constants/constants'

export const getAssistantVisibility = (onModeration?: boolean) => [
  {
    name: 'Private',
    id: VISIBILITY_STATUS.PRIVATE,
    description: i18n.t('modals.publish_assistant.radio_btns.private'),
  },
  {
    name: 'Unlisted',
    id: VISIBILITY_STATUS.UNLISTED_LINK,
    description: i18n.t('modals.publish_assistant.radio_btns.unlisted'),
  },
  {
    name: 'Public',
    id: VISIBILITY_STATUS.PUBLIC_TEMPLATE,
    description: onModeration
      ? i18n.t('modals.publish_assistant.radio_btns.on_moderation')
      : i18n.t('modals.publish_assistant.radio_btns.public'),
  },
]
