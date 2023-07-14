import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useQueryClient } from 'react-query'
import { Button } from 'components/Buttons'
import s from './ErrorHandler.module.scss'

interface Props {
  error: any
}

export const ErrorHandler: FC<Props> = ({ error }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'assistants_not_loaded',
  })
  const queryClient = useQueryClient()
  const handleRetryClick = () => queryClient.invalidateQueries()

  return (
    <>
      {error && (
        <div className={s.error}>
          {t('header')}
          <Button theme='secondary' props={{ onClick: handleRetryClick }}>
            {t('btns.retry')}
          </Button>
        </div>
      )}
    </>
  )
}
