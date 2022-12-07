import React from 'react'
import s from './SmallTag.module.scss'

interface SmallTagProps extends React.PropsWithChildren {
  theme?: 'default' | 'version' | 'success' | 'error'
  isLoading?: boolean
}

const SmallTag = ({ theme, isLoading, children }: SmallTagProps) => {
  return (
    <span
      className={`${s.smallTag} ${theme ? s[`smallTag_theme_${theme}`] : ''} ${
        isLoading ? s.smallTag_state_loading : ''
      }`}>
      {children}
    </span>
  )
}

export default SmallTag
