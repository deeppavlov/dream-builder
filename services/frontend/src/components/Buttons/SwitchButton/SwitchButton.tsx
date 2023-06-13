import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { TIntegrationTabType } from 'types/types'
import { INTEGRATION_ACTIVE_TAB } from 'constants/constants'
import { consts } from 'utils/consts'
import s from './SwitchButton.module.scss'

export const SwitchButton = () => {
  const cx = classNames.bind(s)
  const { UIOptions, setUIOption } = useUIOptions()
  const activeTab: TIntegrationTabType =
    UIOptions[consts.INTEGRATION_ACTIVE_TAB]
  const webChatActive = activeTab === INTEGRATION_ACTIVE_TAB.CHAT
  const APICallActive = activeTab === INTEGRATION_ACTIVE_TAB.API

  const webChatHandler = () => {
    setUIOption({
      name: consts.INTEGRATION_ACTIVE_TAB,
      value: INTEGRATION_ACTIVE_TAB.CHAT,
    })
  }
  const APICallHandler = () => {
    setUIOption({
      name: consts.INTEGRATION_ACTIVE_TAB,
      value: INTEGRATION_ACTIVE_TAB.API,
    })
  }

  return (
    <div className={s.container}>
      <button
        onClick={webChatHandler}
        className={cx('switch', 'left', { active: webChatActive })}
      >
        Web Chat
      </button>
      <button
        onClick={APICallHandler}
        className={cx('switch', 'right', { active: APICallActive })}
      >
        API Call
      </button>
    </div>
  )
}
