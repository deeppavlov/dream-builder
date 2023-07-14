import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { TIntegrationTabType } from 'types/types'
import { API_CALL_TAB } from 'constants/constants'
import { consts } from 'utils/consts'
import s from './SwitchButtonAPICall.module.scss'

export const SwitchButtonAPICall = () => {
  const { UIOptions, setUIOption } = useUIOptions()
  const activeTab: TIntegrationTabType = UIOptions[consts.API_CALL_ACTIVE_TAB]
  const cx = classNames.bind(s)

  const curlHandler = () => {
    setUIOption({
      name: consts.API_CALL_ACTIVE_TAB,
      value: API_CALL_TAB.CURL,
    })
  }
  const nodeHandler = () => {
    setUIOption({
      name: consts.API_CALL_ACTIVE_TAB,
      value: API_CALL_TAB.NODE,
    })
  }
  const pythonHandler = () => {
    setUIOption({
      name: consts.API_CALL_ACTIVE_TAB,
      value: API_CALL_TAB.PYTHON,
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
