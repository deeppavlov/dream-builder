import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useObserver } from '../../hooks/useObserver'
import { RoutesList } from '../../router/RoutesList'
import BaseModal from '../../ui/BaseModal/BaseModal'
import Button from '../../ui/Button/Button'
import s from './ApiTokenErrorModa.module.scss'

type TTokenError = 'not-valid' | 'not-entered'

interface Props {
  detail: {
    errorType: TTokenError
  }
}

export const ApiTokenErrorModal = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState<TTokenError | null>(null)
  const nav = useNavigate()

  const handleEventUpdate = ({ detail: { errorType } }: Props) => {
    setError(errorType ?? null)
    setIsOpen(true)
  }

  // const handleCancelClick = () => setIsOpen(false)

  const handleContinueBtnClick = () => nav(RoutesList.profile)

  useObserver('ApiTokenErrorModal', handleEventUpdate)

  return (
    <BaseModal isOpen={isOpen} setIsOpen={setIsOpen} type='quit'>
      <div className={s.apiTokenErrorModal}>
        <h4>{error === 'not-entered' && 'Your OpenAI token not entered'}</h4>
        <span className={s.desc}>
          Please enter your presonal access token on{' '}
          <Link to={RoutesList.profile}>Profile page</Link>
        </span>
        <div className={s.btns}>
          {/* <Button theme='secondary' props={{ onClick: handleCancelClick }}>
            Cancel
          </Button> */}
          <Button theme='primary' props={{ onClick: handleContinueBtnClick }}>
            Go to Profile
          </Button>
        </div>
      </div>
    </BaseModal>
  )
}
