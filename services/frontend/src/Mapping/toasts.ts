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
    error: 'Something Went Wrong...',
  },
  deleteDeployment: {
    loading: 'Stop deploy...',
    success: 'Deploy Stopped!',
    error: 'Something Went Wrong...',
  },
  deploy: {
    loading: 'Loading...',
    success: 'Sent For Deploy!',
    error: 'Something Went Wrong...',
  },
  createAssistant: {
    loading: 'Creating...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  cloneAssistant: {
    loading: 'Cloning...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  renameAssistant: {
    loading: 'Renaming...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  deleteComponent: {
    loading: 'Deleting...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  createComponent: {
    loading: 'Creating...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  addComponent: {
    loading: 'Adding...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  confirmRequest: {
    loading: 'approve...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
  declineRequest: {
    loading: 'decline...',
    success: 'Success!',
    error: 'Something Went Wrong...',
  },
}
