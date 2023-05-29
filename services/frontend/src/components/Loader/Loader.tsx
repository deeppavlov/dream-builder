import { FC } from 'react'
import { RotatingLines } from 'react-loader-spinner'

export const Loader: FC = () => {
  return (
    <RotatingLines
      strokeColor='grey'
      strokeWidth='5'
      animationDuration='0.75'
      width='48'
      visible={true}
    />
  )
}
