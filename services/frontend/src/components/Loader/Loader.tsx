import { FC } from 'react'

interface Props {
  isLoading: boolean
}

export const Loader: FC<Props> = ({ isLoading }) => {
  return <>{isLoading && 'Loading...'}</>
}
