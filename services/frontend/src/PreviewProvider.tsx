import { FC, createContext, useContext, useMemo, useState } from 'react'
import { IPreviewContext } from './types/types'

export const PreviewContext = createContext<IPreviewContext>(
  {} as IPreviewContext
)
export const usePreview = () => useContext(PreviewContext)

export const PreviewProvider: FC = ({
  children,
}: {
  children?: React.ReactNode
}) => {
  const [isPreview, setIsPreview] = useState(false)
  const previewContextValue = useMemo(
    () => ({
      isPreview,
      setIsPreview,
    }),
    [isPreview]
  )

  return (
    <PreviewContext.Provider value={previewContextValue}>
      {children}
    </PreviewContext.Provider>
  )
}
