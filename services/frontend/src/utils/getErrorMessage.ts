import { useTranslation } from 'react-i18next'

interface IErrorMessage {
  title: string
  message: string
}

export const getErrorMessage = (status: number): IErrorMessage => {
  const { t } = useTranslation('translation', { keyPrefix: 'page_errors' })

  return {
    title: t(`${status}.title` as any),
    message: t(`${status}.message` as any),
  }
}
