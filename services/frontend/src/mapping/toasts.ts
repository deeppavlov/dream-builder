interface ToastSettings {
  loading: string
  success: string
  error: string
}

type ToastKeys =
  | 'deleteToken'
  | 'deleteDeployment'
  | 'deploy'
  | 'createAssistant'
  | 'cloneAssistant'
  | 'renameAssistant'
  | 'deleteComponent'
  | 'createComponent'
  | 'addComponent'
  | 'confirmRequest'
  | 'declineRequest'

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
    loading: 'approve...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
  declineRequest: {
    loading: 'decline...',
    success: 'Success!',
    error: 'Something went wrong...',
  },
}
