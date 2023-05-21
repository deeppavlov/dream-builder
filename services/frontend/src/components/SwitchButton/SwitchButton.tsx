import classNames from 'classnames/bind'
import { INTEGRATION_ACTIVE_TAB } from '../../constants/constants'
import { TIntegrationTabType, useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'
import s from './SwitchButton.module.scss'

export const SwitchButton = () => {
  const cx = classNames.bind(s)

  const { options, dispatch } = useDisplay()

  const activeTab: TIntegrationTabType = options.get(
    consts.INTEGRATION_ACTIVE_TAB
  )

  const webChatHandler = () => {
    dispatch({
      type: 'set',
      option: {
        id: consts.INTEGRATION_ACTIVE_TAB,
        value: INTEGRATION_ACTIVE_TAB.CHAT,
      },
    })
  }
  const APICallHandler = () => {
    dispatch({
      type: 'set',
      option: {
        id: consts.INTEGRATION_ACTIVE_TAB,
        value: INTEGRATION_ACTIVE_TAB.API,
      },
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
