import classNames from 'classnames/bind'
import { API_CALL_TAB } from '../../constants/constants'
import { TIntegrationTabType, useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import s from './SwitchButtonAPICall.module.scss'

export const SwitchButtonAPICall = () => {
  const cx = classNames.bind(s)

  const { options, dispatch } = useDisplay()

  const activeTab: TIntegrationTabType = options.get(consts.API_CALL_ACTIVE_TAB)

  const curlHandler = () => {
    dispatch({
      type: 'set',
      option: {
        id: consts.API_CALL_ACTIVE_TAB,
        value: API_CALL_TAB.CURL,
      },
    })
  }
  const nodeHandler = () => {
    dispatch({
      type: 'set',
      option: {
        id: consts.API_CALL_ACTIVE_TAB,
        value: API_CALL_TAB.NODE,
      },
    })
  }
  const pythonHandler = () => {
    dispatch({
      type: 'set',
      option: {
        id: consts.API_CALL_ACTIVE_TAB,
        value: API_CALL_TAB.PYTHON,
      },
    })
  }
  return (
    <div className={s.container}>
      <button
        onClick={curlHandler}
        className={cx(
          'switch',
          'left',
          activeTab === API_CALL_TAB.CURL && 'active'
        )}
      >
        cURL
      </button>
      <button
        onClick={nodeHandler}
        className={cx(
          'switch',
          'middle',
          activeTab === API_CALL_TAB.CURL && 'leftActive',
          activeTab === API_CALL_TAB.PYTHON && 'rightActive',
          activeTab === API_CALL_TAB.NODE && 'active'
        )}
      >
        NodeJS
      </button>
      <button
        onClick={pythonHandler}
        className={cx(
          'switch',
          'right',
          activeTab === API_CALL_TAB.PYTHON && 'active'
        )}
      >
        Python
      </button>
    </div>
  )
}
