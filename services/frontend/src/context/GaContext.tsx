import {
  FC,
  PropsWithChildren,
  createContext,
  useContext,
  useState,
} from 'react'

interface IGaOptions {
  [key: string]: string
}

interface IGaContext {
  gaState: IGaOptions
  setGaState: React.Dispatch<React.SetStateAction<IGaOptions>>
}

export const GaContext = createContext<IGaContext>({} as IGaContext)

export const GaContextProvider: FC<PropsWithChildren> = ({ children }) => {
  const [gaState, setGaState] = useState<IGaOptions>({})

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
