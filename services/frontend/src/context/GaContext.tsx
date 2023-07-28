import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'
import { IGaContext, IGaOptions } from 'types/types'

export const GaContext = createContext<IGaContext>({} as IGaContext)

export const GaContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [gaState, setGaState] = useState<IGaOptions>({} as IGaOptions)

  return (
    <GaContext.Provider
      value={{
        gaState,
        setGaState,
      }}
    >
      {children}
    </GaContext.Provider>
  )
}

export const useGAContext = () => useContext(GaContext)
