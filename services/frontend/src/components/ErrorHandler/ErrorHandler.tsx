import { FC } from 'react'
import { useQueryClient } from 'react-query'
import Button from '../../ui/Button/Button'
import s from './ErrorHandler.module.scss'

interface Props {
  error: any
}

export const ErrorHandler: FC<Props> = ({ error }) => {
  const queryClient = useQueryClient()
  const handleRetryClick = () => queryClient.invalidateQueries()

  return (
    <>
      {error && (
        <div className={s.error}>
          Oops, something went wrong... Please try again later
          <Button theme='secondary' props={{ onClick: handleRetryClick }}>
            Retry
          </Button>
        </div>
      )}
    </>
  )
}
