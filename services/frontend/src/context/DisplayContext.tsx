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

type TOptionsMap = Map<string, TOptionValue>

type TAction = 'reset' | 'set' | 'delete'

interface IAction {
  type: TAction
  option: {
    id: string
    value?: TOptionValue
  }
}

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

const DisplayContext = createContext({})

const displayReducer = (options: TOptionsMap, action: IAction): TOptionsMap => {
  const { type, option } = action

  switch (type) {
    case 'reset': {
      return options
    }

    case 'set': {
      return new Map([...options, ...new Map([[option.id, option.value]])])
    }

    case 'delete': {
      options.delete(option.id)
      return options
    }

    default: {
      throw Error('Unknown action: ' + action.type)
    }
  }
}

export const DisplayProvider = ({ children }: Props) => {
  const [options, dispatch] = useReducer(displayReducer, initialOptions)
  // const computed = {}
  const value = useMemo(() => ({ options, dispatch }), [options])

  return (
    <DisplayContext.Provider value={value}>{children}</DisplayContext.Provider>
  )
}

export const useDisplay = () =>
  useContext(DisplayContext) as {
    options: TOptionsMap
    dispatch: (action: IAction) => void
  }
