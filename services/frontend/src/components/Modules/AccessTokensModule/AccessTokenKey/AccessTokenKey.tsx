import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useAuth } from 'context'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { IUserApiKey } from 'types/types'
import { trigger } from 'utils/events'
import { Checkbox } from 'components/Buttons'
import s from './AccessTokenKey.module.scss'

interface IProps {
  removeApiKey: (apiServiceId: number) => void
  apiKey: IUserApiKey
  updateApiKey: (newToken: IUserApiKey) => void
}
const AccessTokenKey = ({ removeApiKey, apiKey, updateApiKey }: IProps) => {
  const { t } = useTranslation()
  const [useForDeepy, setUseForDeepy] = useState(apiKey.useForDeepy)

  const { user } = useAuth()

  const isOpenAi = apiKey.api_service.name === 'openai_api_key'

  const handleChange = () => {
    const deepySessionName = `deepySession_${user!.id}`
    const localSession = store(deepySessionName)
    if (!useForDeepy) {
      store(deepySessionName, {
        ...localSession,
        dummy: false,
      })
    }
    updateApiKey({ ...apiKey, useForDeepy: !useForDeepy })
    setUseForDeepy(prev => !prev)
    trigger('AccessTokensChanged', { newValue: !useForDeepy })
  }

  return (
    <li className={s.container}>
      <div className={s.token}>
        <TokenKeyIcon className={s.icon} />
        <div className={s.tokenName}>{apiKey.api_service.display_name}</div>
        <div className={s.right}>
          <button
            className={s.remove}
            onClick={() => removeApiKey(apiKey.api_service.id)}
          >
            {t('modals.access_api_keys.btns.remove')}
          </button>
        </div>
      </div>
      {isOpenAi && (
        <div className={s.string}>
          <Checkbox
            label={t('modals.access_api_keys.checkbox')}
            checked={useForDeepy}
            props={{ className: s.checkbox, onChange: handleChange }}
          />
        </div>
      )}
    </li>
  )
}
export default AccessTokenKey
