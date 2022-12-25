import { ReactNode } from 'react'
import s from './Container.module.scss'

interface ContainerProps {
  children?: ReactNode
}

export const Container = ({ children, ...props }: ContainerProps) => {
  return (
    <div
      style={{
        ...props,
      }}
      className={s.container}>
      {children}
    </div>
  )
}
