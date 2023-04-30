import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useQuery } from 'react-query'
import { getTokens } from '../../services/getTokens'
import { getUserId } from '../../services/getUserId'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import { validationSchema } from '../../utils/validationSchema'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './AccessTokensBanner.module.scss'

type TTokenState = 'not-valid' | 'validating' | 'valid'

interface IService {
  base_url: string
  description: string
  id: number
  name: string
}

interface IUserToken {
  id: number
  user_id: number
  api_token: IService
  token_value: string
}

interface FormValues {
  token: string
  service: string
}

const getTokensObjectName = (userId: number) => `user_${userId}_api_keys`

export const getLocalStorageApiTokens = (userId: number) => {
  const localStorageTokens = localStorage.getItem(getTokensObjectName(userId))
  return localStorageTokens ? JSON.parse(localStorageTokens) : null
}

export const AccessTokensBanner = () => {
  const [service, setService] = useState<IService | null>(null)
  const { data: user } = useQuery(['user'], () => getUserId())
  const { data: api_services } = useQuery<IService[]>(['api_services'], () =>
    getTokens()
  )
  const [tokens, setTokens] = useState<IUserToken[] | null>(null)
  const { handleSubmit, reset, getValues, control, watch } =
    useForm<FormValues>({ mode: 'onSubmit' })

  const deleteToken = (token_id: number) =>
    new Promise((resolve, reject) => {
      const isTokens = tokens !== undefined && tokens !== null

      if (!isTokens) return reject('No tokens found.')

      setTokens(prev => {
        const newState = prev?.filter(({ id }) => id !== token_id) ?? prev
        localStorage.setItem(
          getTokensObjectName(user?.id),
          JSON.stringify(newState)
        )
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

  const createUserToken = (data: FormValues) =>
    new Promise((resolve, reject) => {
      const isService = service !== undefined && service !== null
      const isUserId = user?.id !== undefined

      if (!isService || !isUserId) return reject('Not find service or userId')

      const newToken = {
        id: 1,
        user_id: user?.id,
        api_token: service,
        token_value: data.token,
      }

      setTokens(prev => {
        const isPrev = prev !== null && prev !== undefined
        const newState = isPrev ? prev?.concat(newToken) ?? prev : [newToken]
        localStorage.setItem(
          getTokensObjectName(user?.id),
          JSON.stringify(newState)
        )
        return newState
      })

      resolve(true)
    })

  const onSubmit = (data: FormValues) => {
    toast.promise(createUserToken(data), {
      loading: 'Creating...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
    reset()
  }

  useEffect(() => {
    setService(
      api_services?.find(({ name }) => name === getValues().service) ?? null
    )
  }, [watch(['service'])])

  useEffect(() => {
    setTokens(getLocalStorageApiTokens(user?.id))
  }, [user])

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
            api_services?.map(s => ({ id: s.id.toString(), name: s.name })) ||
            []
          }
          control={control}
          rules={{ required: true }}
          props={{ placeholder: 'Choose service' }}
        />
      </form>
      {tokens && (
        <ul className={s.tokens}>
          {tokens.map(({ id, api_token }: IUserToken) => (
            <li className={s.token} key={id}>
              <TokenKeyIcon className={s.icon} />
              <div className={s.tokenName}>{api_token.name}</div>
              <div className={s.right}>
                {/* {state && (
                  <SmallTag theme={state}>{state.replace(/-/g, ' ')}</SmallTag>
                )} */}
                {/* <button
                  className={s.validate}
                  onClick={() => handleValidateBtnClick(id)}
                >
                  Validate
                </button> */}
                <button
                  className={s.remove}
                  onClick={() => handleRemoveBtnClick(id)}
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
