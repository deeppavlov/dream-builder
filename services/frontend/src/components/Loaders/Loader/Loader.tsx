import { FC } from 'react'
import { RotatingLines } from 'react-loader-spinner'

interface LoaderProps {
  width: string
}

export const Loader: FC<LoaderProps> = ({ width }) => {
  return (
    <RotatingLines
      strokeColor='grey'
      strokeWidth='5'
      animationDuration='0.75'
      width={width || '48'}
      visible={true}
    />
  )
}
