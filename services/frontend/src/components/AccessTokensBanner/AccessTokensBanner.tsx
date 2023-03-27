import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { SmallTag } from '../SmallTag/SmallTag'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { getUserId } from '../../services/getUserId'
import { getTokens } from '../../services/getTokens'
import { postUserTokens } from '../../services/postUserTokens'
import s from './AccessTokensBanner.module.scss'

type TTokenState = 'not-valid' | 'validating' | 'valid'

interface IToken {
  base_url: string
  description: string
  id: number
  name: string
  state?: TTokenState
}

interface IPostToken {
  id: number
  user_id: number
  api_token_id: number
  token_value: string
}

interface FormValues {
  tokenValue: string
  tokenService: string
}

export const AccessTokensBanner = () => {
  const { handleSubmit, register, reset, setValue, formState } =
    useForm<FormValues>({ mode: 'onSubmit' })
  const mockServices = ['OpenAI']
  const [tokens, setTokens] = useState<IToken[]>([])
  const { errors } = formState
  const queryClient = useQueryClient()
  const { data: user } = useQuery(['user'], () => getUserId())
  const { data: api_tokens } = useQuery(['api_tokens'], () => getTokens(), {
    onSuccess: setTokens,
  })

  const setTokenState = (id: number, state: TTokenState) => {
    setTokens(prev =>
      prev.map(token => {
        if (token.id === id) {
          return { ...token, ...{ state } }
        }
        return token
      })
    )
  }

  // Mock Validating timeout
  const handleValidateBtnClick = (id: number) => {
    setTokenState(id, 'validating')
    setTimeout(() => {
      setTokenState(id, 'valid')
    }, 600)
  }

  // Mock Remove
  const handleRemoveBtnClick = (id: number) =>
    setTokens(prev => prev.filter(token => token.id !== id))

  const createUserToken = useMutation({
    mutationFn: ({ tokenService, tokenValue }: FormValues) => {
      return postUserTokens({
        user_id: user?.id,
        api_token_id: 1,
        token_value: tokenValue,
      })
    },
    onSuccess: (data: IPostToken) =>
      queryClient.invalidateQueries({ queryKey: 'api_tokens' }).then(() => {
        setTokens(prev => [
          ...[{ id: data?.api_token_id, name: data?.token_value } as IToken],
          ...prev,
        ])
      }),
  })

  const onSubmit = (data: FormValues) => {
    toast.promise(createUserToken.mutateAsync(data), {
      loading: 'Creating...',
      success: 'Success!',
      error: 'Something Went Wrong...',
    })
    reset({ tokenValue: '' })
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
          error={errors.tokenValue}
          props={{
            placeholder: 'Assistive text',
            ...register('tokenValue', { required: true }),
          }}
        />
        <SkillDropboxSearch
          label='Choose service:'
          list={mockServices}
          error={errors.tokenService}
          onSelect={v => setValue('tokenService', v)}
          props={{
            placeholder: 'Choose service',
            ...register('tokenService', { required: true }),
          }}
        />
      </form>
      {tokens && (
        <ul className={s.tokens}>
          {tokens.map(({ id, name, state }, i) => (
            <li className={s.token} key={id + name + i}>
              <TokenKeyIcon className={s.icon} />
              <div className={s.tokenName}>{name}</div>
              <div className={s.right}>
                {state && (
                  <SmallTag theme={state}>{state.replace(/-/g, ' ')}</SmallTag>
                )}
                <button
                  className={s.validate}
                  onClick={() => handleValidateBtnClick(id)}>
                  Validate
                </button>
                <button
                  className={s.remove}
                  onClick={() => handleRemoveBtnClick(id)}>
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
