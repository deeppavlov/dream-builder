import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import { toasts } from '../../mapping/toasts'
import { getTokens } from '../../services/getTokens'
import { getUserId } from '../../services/getUserId'
import { IApiService, IUserApiKey } from '../../types/types'
import { Input } from '../../ui/Input/Input'
import { trigger } from '../../utils/events'
import { getApiKeysLSId, getLSApiKeys } from '../../utils/getLSApiKeys'
import { validationSchema } from '../../utils/validationSchema'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './AccessTokensModule.module.scss'

interface FormValues {
  token: string
  service: string
}

export const AccessTokensModule = () => {
  const { t } = useTranslation()
  const { data: user } = useQuery(['user'], () => getUserId())
  const { data: api_services } = useQuery<IApiService[]>(['api_services'], () =>
    getTokens()
  )
  const [tokens, setTokens] = useState<IUserApiKey[] | null>(null)
  const { handleSubmit, reset, control } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const localStorageName = getApiKeysLSId(user?.id)

  const handleChanges = () => trigger('AccessTokensChanged', {})

  const clearTokens = () => localStorage.removeItem(localStorageName)

  const saveTokens = (newState: IUserApiKey[] | null) => {
    const isTokens = newState !== null && newState?.length > 0

    if (!isTokens) return clearTokens()
    localStorage.setItem(localStorageName, JSON.stringify(newState))
  }

  const deleteToken = (token_id: number) =>
    new Promise((resolve, reject) => {
      const isTokens = tokens !== undefined && tokens !== null

      if (!isTokens) return reject(t('modals.tokens.logic.no_found_token'))
      setTokens(prev => {
        const newState =
          prev?.filter(({ api_service }) => api_service.id !== token_id) ?? prev

        saveTokens(newState)
        return newState
      })
      resolve(true)
    })

  const handleRemoveBtnClick = (token_id: number) => {
    toast
      .promise(deleteToken(token_id), toasts.deleteToken)
      .finally(() => handleChanges())
  }

  const updateToken = (index: number, token: IUserApiKey) =>
    new Promise(resolve => {
      setTokens(prev => {
        const isPrev = prev !== null && prev !== undefined
        const newState = isPrev ? prev : [token]

        if (!isPrev) return newState
        newState?.splice(index, 1, token)
        saveTokens(newState)
        return newState
      })
      resolve(t('modals.tokens.logic.token_updated'))
    })

  const createUserToken = (data: FormValues) =>
    new Promise((resolve, reject) => {
      const service = api_services?.find(
        ({ display_name }) => display_name === data.service
      )
      const isService = service !== undefined
      const isUserId = user?.id !== undefined

      if (!isService || !isUserId)
        return reject(t('modals.tokens.logic.service_no_found'))

      const newToken: IUserApiKey = {
        api_service: service,
        token_value: data.token,
      }
      const apiTokenIndex = tokens?.findIndex(
        ({ api_service }) => api_service.id === service?.id
      )
      const isIndex = apiTokenIndex !== undefined && apiTokenIndex !== -1

      if (isIndex) {
        trigger('ConfirmApiTokenUpdate', {
          serviceName: data.service,
          onContinue: () => {
            updateToken(apiTokenIndex, newToken)
            resolve(t('modals.tokens.logic.token_updated'))
          },
          onCancel: () => resolve(t('modals.tokens.logic.token_canceled')),
        })
        return
      }

      setTokens(prev => {
        const newState = prev ?? []

        newState.push(newToken)
        saveTokens(newState)
        return newState
      })

      resolve(t('modals.tokens.logic.token_created'))
    })

  const onSubmit = (data: FormValues) => {
    toast
      .promise(createUserToken(data), {
        loading: t('modals.tokens.logic.creating'),
        success: data => `${data}`,
        error: data => `${data}`,
      })
      .finally(() => handleChanges())
    reset()
  }

  useEffect(() => setTokens(getLSApiKeys(user?.id)), [user])

  return (
    <div className={s.module}>
      <h5 className={s.title}>{t('modals.tokens.header')}</h5>
      <p className={s.annotations}>{t('modals.tokens.body')}</p>
      <form className={s.add} onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='token'
          label={t('modals.tokens.input.label')}
          control={control}
          withEnterButton
          rules={{ required: validationSchema.global.required }}
          props={{ placeholder: t('modals.tokens.input.placeholder') }}
        />
        <SkillDropboxSearch
          name='service'
          label={t('modals.tokens.dropbox.label')}
          list={
            api_services?.map(s => ({
              id: s.id.toString(),
              name: s.display_name,
            })) || []
          }
          control={control}
          rules={{ required: true }}
          props={{ placeholder: t('modals.tokens.dropbox.placeholder') }}
        />
      </form>
      {tokens && (
        <ul className={s.tokens}>
          {tokens.map(({ api_service }: IUserApiKey) => (
            <li className={s.token} key={api_service.id}>
              <TokenKeyIcon className={s.icon} />
              <div className={s.tokenName}>{api_service.display_name}</div>
              <div className={s.right}>
                <button
                  className={s.remove}
                  onClick={() => handleRemoveBtnClick(api_service.id)}
                >
                  {t('modals.tokens.btn.remove')}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
