import { useAuth } from 'context'
import { FC, useEffect, useState } from 'react'
import { ReactComponent as CheckIcon } from 'assets/icons/microscope.svg'
import { IUserApiKey, LM_Service } from 'types/types'
import { useApiKeys } from 'hooks/api/useApiKeys'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import {
  hideKeyValue,
  isKeyRequiredForModel,
  saveTokens,
} from 'utils/localStorageTokens'
import { Button, Checkbox } from 'components/Buttons'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import s from './LanguageModelItem.module.scss'

interface IProps {
  apiKey: IUserApiKey
  lmService: LM_Service
}

const iconMapping = {
  valid: 'checkbox_mark',
  invalid: 'cross',
  unchecked: 'question',
  loading: 'loading',
}

const LanguageModelItem: FC<IProps> = ({ apiKey, lmService }) => {
  const { validationState, setValidationState, checkApiKey } = useApiKeys()
  const { user } = useAuth()
  const userId = user?.id

  const lsApiKeys = getLSApiKeys(Number(userId)) || []
  const currentKey = lsApiKeys?.find(key =>
    isKeyRequiredForModel(key, lmService.name)
  )!

  useEffect(() => {
    const currentLSValidationState =
      currentKey?.lmValidationState[lmService.name]
    if (!currentLSValidationState) return

    if (currentLSValidationState?.status !== validationState.status)
      setValidationState(currentKey?.lmValidationState[lmService.name])
  }, [currentKey?.lmValidationState])

  const [checked, setChecked] = useState<boolean>(
    !!currentKey.lmUsageState[lmService.name]
  )

  const handleCheckboxClick = () => {
    const lsApiKeys = getLSApiKeys(Number(userId)) || []
    const currentKey = lsApiKeys?.find(key =>
      isKeyRequiredForModel(key, lmService.name)
    )!
    const { lmUsageState } = currentKey
    const currentKeyIndex = Number(lsApiKeys?.indexOf(currentKey!))
    const localStorageName = getApiKeysLSId(user!.id)

    lsApiKeys[currentKeyIndex] = {
      ...currentKey,
      lmUsageState: { ...lmUsageState, [lmService.name]: !checked },
    }
    setChecked(prev => !prev)
    saveTokens(localStorageName, lsApiKeys)
    trigger('AccessTokensChanged', {})
  }

  const hiddenTokenValue = hideKeyValue(apiKey.token_value)

  return (
    <>
      <td className={s.first}>
        <div className={s.name}>
          <Checkbox
            props={{ onChange: handleCheckboxClick }}
            checked={checked}
            theme='secondary'
            label={lmService?.display_name}
          />
        </div>
      </td>
      <td>
        <div className={s.value}>{hiddenTokenValue}</div>
      </td>
      <td>
        <div
          className={s.status}
          data-tooltip-id={`lm-service-${lmService.id}`}
        >
          <SvgIcon
            iconName={iconMapping[validationState.status]}
            svgProp={{ className: s[validationState.status] }}
          />
        </div>
      </td>
      <td className={s.last}>
        <div className={s.btn}>
          <Button
            small
            theme='primary'
            withIcon
            props={{
              onClick: () =>
                checkApiKey.mutateAsync({
                  lmService,
                  tokenValue: apiKey.token_value,
                }),
            }}
          >
            <CheckIcon className={s.buttonIcon} />
          </Button>
        </div>
      </td>
      <BaseToolTip
        id={`lm-service-${lmService.id}`}
        content={validationState.message}
        theme='description'
        clickable
      />
    </>
  )
}

export default LanguageModelItem
