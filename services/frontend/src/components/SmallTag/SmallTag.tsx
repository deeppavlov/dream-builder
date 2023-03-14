import React, { FC } from 'react'
import s from './SmallTag.module.scss'

interface SmallTagProps extends React.PropsWithChildren {
  theme?: 'default' | 'version' | 'success' | 'error'
  isLoading?: boolean
}

export const SmallTag: FC<SmallTagProps> = ({ theme, isLoading, children }) => {
  return (
    <span
      className={`${s.smallTag} ${theme ? s[`smallTag_theme_${theme}`] : ''} ${
        isLoading ? s.smallTag_state_loading : ''
      }`}>
      {children}
    </span>
  )
}
