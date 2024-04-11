import { useAuth } from 'context'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { ReactComponent as Attention } from 'assets/icons/attention.svg'
import { ReactComponent as Microscope } from 'assets/icons/microscope.svg'
import { IUserApiKey, LM_Service } from 'types/types'
import { useApiKeys } from 'hooks/api/useApiKeys'
import { useGaToken } from 'hooks/googleAnalytics/useGaToken'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import { getValidationSchema } from 'utils/getValidationSchema'
import { isKeyRequiredForModel, saveTokens } from 'utils/localStorageTokens'
import { Button, Checkbox } from 'components/Buttons'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { Input } from 'components/Inputs'
import s from './AccessTokensModule.module.scss'
import { AccessTokensTable } from './AccessTokensTable/AccessTokensTable'

interface FormValues {
  token: string
  service: LM_Service
}

export const AccessTokensModule = () => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'modals.access_api_keys',
  })
  const { user } = useAuth()
  const { openTokenModal, tokenPasted, addOrDeleteToken } = useGaToken()
  const { apiServices, lmServices, checkApiKey } = useApiKeys()
  const [tokens, setTokens] = useState<IUserApiKey[] | null>(null)
  const { handleSubmit, reset, control, watch } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const localStorageName = getApiKeysLSId(user?.id!)
  const validationSchema = getValidationSchema()

  const handleChanges = () => trigger('AccessTokensChanged', {})

  const updateToken = (index: number, token: IUserApiKey) =>
    new Promise(resolve => {
      setTokens(prev => {
        const isPrev = prev !== null && prev !== undefined
        const newState = isPrev ? prev : [token]

        if (!isPrev) return newState
        newState?.splice(index, 1, token)
        saveTokens(localStorageName, newState)
        return newState
      })
      resolve(t('toasts.token_updated'))
    })

  const createUserToken = ({ service, token }: FormValues) =>
    new Promise((resolve, reject) => {
      const selectedService = apiServices.data?.find(
        ({ id }) => `${id}` === service?.id?.toString()
      )

      const isService = selectedService !== undefined
      const isUserId = user?.id !== undefined

      if (!isService || !isUserId) return reject(t('toasts.not_found_service'))

      const newToken: IUserApiKey = {
        api_service: selectedService,
        token_value: token,
        useForDeepy: false,
        id: Date.now(),
        lmValidationState: {},
        lmUsageState: {},
      }
      const apiTokenIndex = tokens?.findIndex(
        ({ api_service }) =>
          api_service.id.toString() === service?.id?.toString()
      )
      const isIndex = apiTokenIndex !== undefined && apiTokenIndex !== -1

      if (isIndex) {
        trigger('ConfirmApiTokenUpdateModal', {
          serviceName: selectedService.display_name,
          onContinue: () => {
            updateToken(apiTokenIndex, newToken)
            resolve(t('toasts.token_updated'))
          },
          onCancel: () => resolve(t('toasts.token_canceled')),
        })
        return
      }

      setTokens(prev => {
        const newState = prev ?? []
        newState.push(newToken)
        saveTokens(localStorageName, newState)
        return newState
      })

      resolve(t('toasts.token_added'))
      addOrDeleteToken(selectedService.display_name, 'add')
    })

  const onSubmit = (data: FormValues) => {
    toast
      .promise(createUserToken(data), {
        loading: t('toasts.token_adding'),
        success: data => `${data}`,
        error: data => `${data}`,
      })
      .finally(() => {
        handleChanges()
        reset()
      })
  }

  useEffect(() => setTokens(getLSApiKeys(user?.id!)), [user])

  const tokenValue = watch('token')
  useEffect(() => {
    tokenPasted(tokenValue)
  }, [tokenValue])

  useEffect(() => {
    openTokenModal()
  }, [])

  const openAIToken = tokens?.find(t => t.api_service.name === 'openai_api_key')

  const [useOpenAIForDeepy, setUseOpenAIForDeepy] = useState<boolean>(false)
  useEffect(() => {
    setUseOpenAIForDeepy(
      !!tokens?.find(t => t.api_service.name === 'openai_api_key')?.useForDeepy
    )
  }, [tokens])

  const handleCheckBoxChange = () => {
    const deepySessionName = `deepySession_${user!.id}`
    const localSession = store(deepySessionName)
    if (!useOpenAIForDeepy) {
      store(deepySessionName, {
        ...localSession,
        dummy: false,
      })
    }

    const openAITokenIndex = tokens?.indexOf(openAIToken!)!
    updateToken(openAITokenIndex, {
      ...openAIToken!,
      useForDeepy: !useOpenAIForDeepy,
    })

    setUseOpenAIForDeepy(prev => !prev)
    trigger('AccessTokensChanged', { newValue: !useOpenAIForDeepy })
  }

  const checkAllLmServices = () => {
    lmServices.data?.forEach(lmService => {
      const currentToken = tokens?.find(token =>
        isKeyRequiredForModel(token, lmService.name)
      )
      if (!currentToken) return

      checkApiKey.mutateAsync({
        lmService,
        tokenValue: currentToken.token_value,
      })
    })
  }

  useObserver('AccessTokensChanged', () => {
    user?.id && setTokens(getLSApiKeys(user?.id))
  })

  return (
    <div className={s.module}>
      <div className={s.body}>
        <h5 className={s.title}>{t('header')}</h5>
        <p className={s.annotations}>{t('desc')}</p>
        <form className={s.add} onSubmit={handleSubmit(onSubmit)}>
          <Input
            name='token'
            label={t('token_field.label')}
            control={control}
            withEnterButton
            rules={{ required: validationSchema.globals.required }}
            props={{
              placeholder: t('token_field.placeholder'),
            }}
          />
          <SkillDropboxSearch
            name='service'
            label={t('service_dropbox.label')}
            list={
              apiServices.data?.map(s => ({
                id: s.id.toString(),
                name: s.name,
                display_name: s.display_name,
              })) || []
            }
            control={control}
            rules={{ required: true }}
            props={{
              placeholder: t('service_dropbox.placeholder'),
            }}
            withoutSearch
          />
        </form>

        {!!tokens?.length && (
          <AccessTokensTable tokens={tokens} setTokens={setTokens} />
        )}

        {openAIToken && (
          <div className={s.checkboxString}>
            <Checkbox
              theme='secondary'
              checked={useOpenAIForDeepy}
              props={{ onChange: handleCheckBoxChange }}
            />
            {t('checkbox')}
          </div>
        )}
      </div>
      <div className={s.footer}>
        <div className={s.container}>
          <div className={s.attention}>
            <Attention />
          </div>
          <div className={s.annotation}>
            {t('attention.annotation.first_line')}
            <br />
            {t('attention.annotation.second_line')}
          </div>
          {!!tokens?.length && (
            <Button
              small
              theme='primary'
              props={{ onClick: () => checkAllLmServices() }}
            >
              <Microscope className={s.buttonIcon} />
              <span>{t('validateAll')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
