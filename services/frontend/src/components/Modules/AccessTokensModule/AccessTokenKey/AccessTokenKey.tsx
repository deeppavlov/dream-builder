import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useTranslation } from 'react-i18next'
import { IUserApiKey } from 'types/types'
import s from './AccessTokenKey.module.scss'

interface IProps {
  removeApiKey: (apiServiceId: number) => void
  apiKey: IUserApiKey
  updateApiKey: (newToken: IUserApiKey) => void
}
const AccessTokenKey = ({ removeApiKey, apiKey }: IProps) => {
  const { t } = useTranslation()

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
    </li>
  )
}
export default AccessTokenKey
