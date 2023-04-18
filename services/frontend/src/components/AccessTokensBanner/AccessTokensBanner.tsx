import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { deleteUserToken } from '../../services/deleteUserToken'
import { getTokens } from '../../services/getTokens'
import { getUserId } from '../../services/getUserId'
import { getUserTokens } from '../../services/getUserTokens'
import { postUserTokens } from '../../services/postUserTokens'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
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

export const AccessTokensBanner = () => {
  const { handleSubmit, register, reset, setValue, formState } =
    useForm<FormValues>({ mode: 'onSubmit' })
  const { errors } = formState
  const [service, setService] = useState<IService | null>(null)
  const queryClient = useQueryClient()
  const { data: user } = useQuery(['user'], () => getUserId())
  const { data: api_services } = useQuery<IService[]>(['api_services'], () =>
    getTokens()
  )
  const { data: user_tokens } = useQuery<IUserToken[]>(
    ['user_tokens'],
    () => getUserTokens(user?.id),
    { enabled: !!user?.id }
  )

  const setTokenState = (id: number, state: TTokenState) => {}

  // Mock Validating timeout
  const handleValidateBtnClick = (id: number) => {
    setTokenState(id, 'validating')
    setTimeout(() => {
      setTokenState(id, 'valid')
    }, 600)
  }

  const deleteToken = useMutation({
    mutationFn: (token_id: string) => {
      return deleteUserToken(user?.id, token_id)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: 'user_tokens',
      }),
  })

  const handleRemoveBtnClick = (token_id: number) => {
    toast.promise(deleteToken.mutateAsync(token_id.toString()), {
      loading: 'Deleting...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
  }

  const createUserToken = useMutation({
    mutationFn: ({ token }: FormValues) => {
      return postUserTokens({
        user_id: user?.id,
        api_token_id: service?.id!,
        token_value: token,
      })
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: 'user_tokens' }),
  })

  const onSubmit = (data: FormValues) => {
    toast.promise(createUserToken.mutateAsync(data), {
      loading: 'Creating...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
    reset()
  }

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
          label='Add a new personal access token:'
          withEnterButton
          formState={formState}
          error={errors.token}
          props={{
            placeholder: 'Assistive text',
            ...register('token', { required: true }),
          }}
        />
        <SkillDropboxSearch
          label='Choose service:'
          list={api_services?.map(s => ({ name: s.name, data: s })) || []}
          error={errors.service}
          onSelect={item => {
            setValue('service', item.name)
            setService(item.data)
          }}
          props={{
            placeholder: 'Choose service',
            ...register('service', { required: true }),
          }}
        />
      </form>
      {user_tokens && (
        <ul className={s.tokens}>
          {user_tokens.map(({ id, api_token }: IUserToken) => (
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
