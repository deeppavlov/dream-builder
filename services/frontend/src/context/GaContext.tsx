import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'
import { BotInfoInterface } from 'types/types'

interface IGaOptions {
  [key: string]: string | boolean | BotInfoInterface | undefined
  assistant?: BotInfoInterface
}

interface IGaContext {
  gaState: IGaOptions
  setGaState: React.Dispatch<React.SetStateAction<IGaOptions>>
}

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
