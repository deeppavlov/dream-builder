import { FC } from 'react'
import Button from '../../ui/Button/Button'
import s from './ErrorHandler.module.scss'

interface Props {
  error: any
}

export const ErrorHandler: FC<Props> = ({ error }) => {
  const handleRetryClick = () => location.reload()

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
