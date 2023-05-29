import {
  ReactNode,
  createContext,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { TApiCallType, TIntegrationTabType } from 'types/types'
import { consts } from 'utils/consts'

type TOptionValue = any

interface IUIOption {
  name: string
  value: TOptionValue
}

type TOptionsMap = Map<string, TOptionValue>

type IComputedUIOptions = { [x: string]: TOptionValue }

interface Props {
  children?: ReactNode
}

const defaultIntegrationTab: TIntegrationTabType = 'CHAT'
const defaultApiCallTab: TApiCallType = 'CURL'

const initialOptions: TOptionsMap = new Map<string, TOptionValue>([
  [consts.IS_PREVIEW_MODE, true],
  [consts.IS_TABLE_VIEW, false],
  [consts.LEFT_SP_IS_ACTIVE, false],
  [consts.RIGHT_SP_IS_ACTIVE, false],
  [consts.BREADCRUMBS_PATH, {}],
  [consts.EDITOR_ACTIVE_TAB, 'Skills'],
  [consts.ACTIVE_ASSISTANT, {}],
  [consts.COPILOT_SP_IS_ACTIVE, false],
  [consts.ACTIVE_ASSISTANT_SP_ID, null],
  [consts.ACTIVE_SKILL_SP_ID, null],
  [consts.ACTIVE_ANNOTATOR_SP_ID, null],
  [consts.INTEGRATION_ACTIVE_TAB, defaultIntegrationTab],
  [consts.API_CALL_ACTIVE_TAB, defaultApiCallTab],
])

const UIOptionsContext = createContext({})

const UIReducer = (
  options: TOptionsMap,
  { name, value }: IUIOption
): TOptionsMap => new Map([...options, [name, value]])

export const UIOptionsProvider = ({ children }: Props) => {
  const [UIOptions, setUIOption] = useReducer(UIReducer, initialOptions)
  const computed = Object.fromEntries(UIOptions)
  const value = useMemo(
    () => ({ UIOptions: computed, setUIOption }),
    [computed]
  )

  return (
    <UIOptionsContext.Provider value={value}>
      {children}
    </UIOptionsContext.Provider>
  )
}

export const useUIOptions = () =>
  useContext(UIOptionsContext) as {
    UIOptions: IComputedUIOptions
    setUIOption: (newOption: IUIOption) => void
  }
