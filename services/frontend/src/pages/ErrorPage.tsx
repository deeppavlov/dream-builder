import { useRouteError } from 'react-router'
import PageErrorHandler from '../components/PageErrorHandler/PageErrorHandler'

const ErrorPage = () => {
  let error = useRouteError() as any
  const defaultErrorStatus = 404
  const status = error?.response?.status ?? defaultErrorStatus

  return <PageErrorHandler status={status} />
}

export default ErrorPage
