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

export const toasts: Toasts = {
  deleteToken: {
    loading: 'Deleting...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  deleteDeployment: {
    loading: 'Stop deploy...',
    success: 'Deploy stopped!',
    error: 'Something went wrong...',
  },
  deploy: {
    loading: 'Loading...',
    success: 'Sent for deploy!',
    error: 'Something went wrong...',
  },
  createAssistant: {
    loading: 'Creating...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  cloneAssistant: {
    loading: 'Cloning...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  renameAssistant: {
    loading: 'Renaming...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  deleteAssistant: {
    loading: 'Deleting...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  deleteComponent: {
    loading: 'Deleting...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  createComponent: {
    loading: 'Creating...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  addComponent: {
    loading: 'Adding...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  confirmRequest: {
    loading: 'Approve...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  declineRequest: {
    loading: 'Decline...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  updateComponent: {
    loading: 'Saving...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  publishAssistant: {
    loading: i18n.t('modals.publish_assistant.toasts.loading'),
    success: i18n.t('modals.publish_assistant.toasts.submitted'),
    error: i18n.t('toasts.error'),
  },
}
