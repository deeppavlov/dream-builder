import { FC } from 'react'

interface Props {
  error: any
}

export const ErrorHandler: FC<Props> = ({ error }) => {
  return <>{error && 'Oops, something went wrong... Please try again later'}</>
}
