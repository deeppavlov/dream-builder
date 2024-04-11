import { ReactComponent as Trash } from '@assets/icons/delete.svg'
import { IUserApiKey, LM_Service } from 'types/types'
import { Button } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import LanguageModelItem from '../LanguageModelItem/LanguageModelItem'
import s from './AccessTokenKey.module.scss'

const apiServiceMap: { [key: string]: string } = {
  openai_api_key: 'openai_company',
  gigachat_credential: 'sber_devices',
  anthropic_api_key: 'anthropic_company',
}
interface IProps {
  removeApiKey: (apiServiceId: number) => void
  apiKey: IUserApiKey
  lmListForToken: LM_Service[]
}

const AccessTokenKey = ({ apiKey, removeApiKey, lmListForToken }: IProps) => {
  const [firstModelService, ...restModelServices] = lmListForToken

  return (
    <>
      <tr>
        <td className={s.td} rowSpan={lmListForToken.length}>
          <div className={s.service}>
            <SvgIcon
              iconName={apiServiceMap[apiKey.api_service.name]}
              svgProp={{ className: s.serviceIcon }}
            />
            {apiKey.api_service.display_name}
          </div>
        </td>
        {firstModelService && (
          <LanguageModelItem lmService={firstModelService} apiKey={apiKey} />
        )}
        <td className={s.td} rowSpan={lmListForToken.length}>
          <Button
            props={{ onClick: () => removeApiKey(apiKey.api_service.id) }}
            small
            withIcon
            theme='secondary'
          >
            <Trash className={s.buttonIcon} />
          </Button>
        </td>
      </tr>
      {restModelServices.map(lm => (
        <tr key={lm.id}>
          <LanguageModelItem lmService={lm} apiKey={apiKey} />
        </tr>
      ))}
    </>
  )
}
export default AccessTokenKey
