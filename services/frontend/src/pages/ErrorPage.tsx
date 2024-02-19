import { Navigate, useRouteError } from 'react-router-dom'
import { TErrorBoundary } from 'types/types'

const ErrorPage = ({ status: initStatus }: Partial<TErrorBoundary>) => {
  let error = useRouteError() as any

  const status = error?.response?.status ?? error?.status ?? initStatus
  const isStatus = status !== undefined && status !== null

  if (!isStatus) console.log(error)
  return <Navigate to='/' />
}

export default ErrorPage
