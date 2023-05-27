import classNames from 'classnames/bind'
import { INTEGRATION_ACTIVE_TAB } from '../../constants/constants'
import {
  TIntegrationTabType,
  useUIOptions,
} from '../../context/UIOptionsContext'
import { consts } from '../../utils/consts'
import s from './SwitchButton.module.scss'

export const SwitchButton = () => {
  const cx = classNames.bind(s)

  const { UIOptions, setUIOption } = useUIOptions()

  const activeTab: TIntegrationTabType =
    UIOptions[consts.INTEGRATION_ACTIVE_TAB]

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
        className={cx(
          'switch',
          'left',
          activeTab === INTEGRATION_ACTIVE_TAB.CHAT && 'active'
        )}
      >
        Web Chat
      </button>
      <button
        onClick={APICallHandler}
        className={cx(
          'switch',
          'right',
          activeTab === INTEGRATION_ACTIVE_TAB.API && 'active'
        )}
      >
        API Call
      </button>
    </div>
  )
}
