import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getTokens } from '../../services/getTokens'
import { getUserId } from '../../services/getUserId'
import { IApiService, IUserApiKey } from '../../types/types'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { trigger } from '../../utils/events'
import { getApiKeysLSId, getLSApiKeys } from '../../utils/getLSApiKeys'
import { validationSchema } from '../../utils/validationSchema'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './AccessTokensBanner.module.scss'

interface FormValues {
  token: string
  service: string
}

export const AccessTokensBanner = () => {
  const { data: user } = useQuery(['user'], () => getUserId())
  const { data: api_services } = useQuery<IApiService[]>(['api_services'], () =>
    getTokens()
  )
  const [tokens, setTokens] = useState<IUserApiKey[] | null>(null)
  const { handleSubmit, reset, control } = useForm<FormValues>({
    mode: 'onSubmit',
  })
  const localStorageName = getApiKeysLSId(user?.id)

  const clearTokens = () => localStorage.removeItem(localStorageName)

  const saveTokens = (newState: IUserApiKey[] | null) => {
    if (newState === null) return clearTokens()
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
    toast.promise(deleteToken(token_id), {
      loading: 'Deleting...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
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

  const createUserToken = (data: FormValues) =>
    new Promise((resolve, reject) => {
      const service = api_services?.find(
        ({ display_name }) => display_name === data.service
      )
      const isService = service !== undefined
      const isUserId = user?.id !== undefined

      if (!isService || !isUserId) return reject('Not find Service or User id')

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
    toast.promise(createUserToken(data), {
      loading: 'Creating...',
      success: data => `${data}`,
      error: data => `${data}`,
    })
    reset()
  }

  useEffect(() => setTokens(getLSApiKeys(user?.id)), [user])

  return (
    <Wrapper>
      <h5 className={s.title}>Personal access tokens</h5>
      <p className={s.annotations}>
        Personal access tokens allow your AI Assistants to use third-party
        services like OpenAI, GNews, News API, etc. You can always remove these
        tokens here if you want to stop use of the services they provide access
        to by your AI Assistants, or you can revoke these tokens in their
        respective services. Do not give out your personal access tokens to
        anybody you don’t want to access your files.
      </p>
      <p className={s.annotations}>
        When you added a token for a given service you will be offered to
        manually validate that token. When you click “Validate” you may incur
        costs associated with invoking API calls to the respective services.
        These costs are usually quite nominal, but we advise you to check with
        the pricing plans of the respective services if in doubt before
        validating your tokens.
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
              name: s.display_name,
            })) || []
          }
          control={control}
          rules={{ required: true }}
          props={{ placeholder: 'Choose service' }}
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
    </Wrapper>
  )
}
