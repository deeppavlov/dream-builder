import { useRouteError } from 'react-router-dom'
import { PageErrorHandler } from 'components/UI'

const ErrorPage = () => {
  let error = useRouteError() as any
  const defaultErrorStatus = 404
  const status = error?.response?.status ?? defaultErrorStatus

  return <PageErrorHandler status={status} />
}

export default ErrorPage
