import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { API_CALL_TAB } from 'types/types'
import { consts } from 'utils/consts'
import s from './SwitchButtonAPICall.module.scss'

export const SwitchButtonAPICall = () => {
  const { UIOptions, setUIOption } = useUIOptions()
  const activeTab: API_CALL_TAB = UIOptions[consts.API_CALL_ACTIVE_TAB]
  const cx = classNames.bind(s)

  const isCurl = activeTab === API_CALL_TAB.CURL
  const isNode = activeTab === API_CALL_TAB.NODE
  const isPython = activeTab === API_CALL_TAB.PYTHON

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
        className={cx('switch', 'left', { active: isCurl })}
      >
        cURL
      </button>
      <button
        onClick={nodeHandler}
        className={cx('switch', 'middle', {
          leftActive: isCurl,
          rightActive: isPython,
          active: isNode,
        })}
      >
        NodeJS
      </button>
      <button
        onClick={pythonHandler}
        className={cx('switch', 'right', { active: isPython })}
      >
        Python
      </button>
    </div>
  )
}
