import { useRouteError } from 'react-router-dom'
import { TErrorBoundary } from 'types/types'
import { PageErrorHandler } from 'components/UI'

const ErrorPage = ({ status: initStatus }: Partial<TErrorBoundary>) => {
  let error = useRouteError() as any
  const status = error?.response?.status ?? error?.status ?? initStatus
  const isStatus = status !== undefined && status !== null

  if (!isStatus) throw error
  return <PageErrorHandler status={status} />
}

export default ErrorPage
