import i18n from 'i18n'

interface ToastSettings {
  loading: string
  success: string
  error: string
}

type ToastKeys =
  | 'deploy'
  | 'deleteDeployment'
  | 'cloneAssistant'
  | 'createAssistant'
  | 'renameAssistant'
  | 'deleteAssistant'
  | 'addComponent'
  | 'createComponent'
  | 'deleteComponent'
  | 'updateComponent'
  | 'confirmRequest'
  | 'declineRequest'
  | 'deleteToken'
  | 'publishAssistant'

type Toasts = Record<ToastKeys, ToastSettings>

export const toasts: () => Toasts = () => ({
  deleteToken: {
    loading: i18n.t('modals.access_api_keys.toasts.token_removing'),
    success: i18n.t('modals.access_api_keys.toasts.token_removed'),
    error: i18n.t('toasts.error'),
  },
  deleteDeployment: {
    loading: i18n.t('sidepanels.assistant_dialog.toasts.stop_deploy'),
    success: i18n.t('sidepanels.assistant_dialog.toasts.deploy_stopped'),
    error: i18n.t('toasts.error'),
  },
  deploy: {
    loading: i18n.t('sidepanels.assistant_dialog.toasts.deploy_loading'),
    success: i18n.t('sidepanels.assistant_dialog.toasts.sent_for_deploy'),
    error: i18n.t('toasts.error'),
  },
  createAssistant: {
    loading: i18n.t('modals.assistant.toasts.create'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  cloneAssistant: {
    loading: i18n.t('modals.assistant.toasts.clone'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  renameAssistant: {
    loading: i18n.t('toasts.rename'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  deleteAssistant: {
    loading: i18n.t('toasts.delete'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  createComponent: {
    loading: i18n.t('toasts.create'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  addComponent: {
    loading: i18n.t('modals.choose_skill.toasts.add'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  confirmRequest: {
    loading: i18n.t('toasts.approve'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  declineRequest: {
    loading: i18n.t('toasts.decline'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  updateComponent: {
    loading: i18n.t('toasts.save'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
  publishAssistant: {
    loading: i18n.t('modals.publish_assistant.toasts.loading'),
    success: i18n.t('modals.publish_assistant.toasts.submitted'),
    error: i18n.t('toasts.error'),
  },
  deleteComponent: {
    loading: i18n.t('toasts.delete'),
    success: i18n.t('toasts.success'),
    error: i18n.t('toasts.error'),
  },
})
