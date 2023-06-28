import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { IApiService, IUserApiKey, LM_Service } from 'types/types'
import { getTokens, getUserId } from 'api/user'
import { trigger } from 'utils/events'
import { getApiKeysLSId, getLSApiKeys } from 'utils/getLSApiKeys'
import { validationSchema } from 'utils/validationSchema'
import { SkillDropboxSearch } from 'components/Dropdowns'
import { Input } from 'components/Inputs'
import s from './AccessTokensModule.module.scss'

interface FormValues {
  token: string
  service: LM_Service
}

export const AccessTokensModule = () => {
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

      if (!isTokens) return reject('No tokens found.')
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
      .promise(deleteToken(token_id), {
        loading: 'Removing...',
        success: 'Successfully removed!',
        error: 'Something went wrong...',
      })
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
      resolve('Successfully created!')
    })

  const createUserToken = ({ service, token }: FormValues) =>
    new Promise((resolve, reject) => {
      const selectedService = api_services?.find(
        ({ id }) => `${id}` === service?.id?.toString()
      )
      const isService = selectedService !== undefined
      const isUserId = user?.id !== undefined

      if (!isService || !isUserId) return reject('Not found Service or User id')

      const newToken: IUserApiKey = {
        api_service: selectedService,
        token_value: token,
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
            resolve('Successfully updated!')
          },
          onCancel: () => resolve('Successfully cancelled!'),
        })
        return
      }

      setTokens(prev => {
        const newState = prev ?? []

        newState.push(newToken)
        saveTokens(newState)
        return newState
      })

      resolve('Successfully created!')
    })

  const onSubmit = (data: FormValues) => {
    toast
      .promise(createUserToken(data), {
        loading: 'Creating...',
        success: data => `${data}`,
        error: data => `${data}`,
      })
      .finally(() => handleChanges())
    reset()
  }

  useEffect(() => setTokens(getLSApiKeys(user?.id)), [user])

  return (
    <div className={s.module}>
      <h5 className={s.title}>Personal access tokens</h5>
      <p className={s.annotations}>
        Personal access tokens allow your AI Assistants to use third-party
        services like OpenAI, GNews, News API, etc. You can always remove these
        tokens here if you want to stop use of the services they provide access
        to by your AI Assistants, or you can revoke these tokens in their
        respective services. Do not give out your personal access tokens to
        anybody you don't want to access your files.
      </p>
      <form className={s.add} onSubmit={handleSubmit(onSubmit)}>
        <Input
          name='token'
          label='Add a new personal access token:'
          control={control}
          withEnterButton
          rules={{ required: validationSchema.global.required }}
          props={{ placeholder: 'Assistive text' }}
        />
        <SkillDropboxSearch
          name='service'
          label='Choose service:'
          list={
            api_services?.map(s => ({
              id: s.id.toString(),
              name: s.name,
              display_name: s.display_name,
            })) || []
          }
          control={control}
          rules={{ required: true }}
          props={{ placeholder: 'Choose service' }}
          withoutSearch
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
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
