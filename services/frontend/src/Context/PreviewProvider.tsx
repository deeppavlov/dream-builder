import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useState,
} from 'react'
import { IPreviewContext } from '../types/types'

interface ProviderProps {
  children?: ReactNode
}
export const PreviewContext = createContext<IPreviewContext>(
  {} as IPreviewContext
)
export const usePreview = () => useContext(PreviewContext)

export const PreviewProvider: FC<ProviderProps> = ({ children }) => {
  const [isPreview, setIsPreview] = useState<boolean>(false)
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
