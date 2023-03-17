import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { SmallTag } from '../SmallTag/SmallTag'
import s from './AccessTokensBanner.module.scss'

type TTokenState = 'not-valid' | 'validating' | 'valid'

interface IToken {
  id: string
  name: string
  state?: TTokenState
}

interface FormValues {
  tokenValue: string
  tokenId: string
}

export const AccessTokensBanner = () => {
  const { handleSubmit, register, reset, setValue, formState } =
    useForm<FormValues>({ mode: 'onSubmit' })
  const mockServices = ['OpenAI']
  const [tokens, setTokens] = useState<IToken[]>([])
  const { errors } = formState

  const getUserTokens = () => {
    const localStorageTokens = localStorage.getItem('API_TOKENS')
    if (!localStorageTokens) return
    return JSON.parse(localStorageTokens)
  }

  const setTokenState = (id: string, state: TTokenState) => {
    setTokens(prev =>
      prev.map(token => {
        if (token.id === id) {
          return { ...token, ...{ state } }
        }
        return token
      })
    )
    localStorage.setItem(
      'API_TOKENS',
      JSON.stringify(
        tokens.map(token => {
          if (token.id === id) {
            return { ...token, ...{ state } }
          }
          return token
        })
      )
    )
  }

  // Mock Validating timeout
  const handleValidateBtnClick = (id: string) => {
    setTokenState(id, 'validating')
    setTimeout(() => {
      setTokenState(id, 'valid')
    }, 600)
  }

  const handleRemoveBtnClick = (id: string) => {
    setTokens(prev => prev.filter(token => token.id !== id))
    localStorage.setItem(
      'API_TOKENS',
      JSON.stringify(tokens.filter(token => token.id !== id))
    )
  }

  // Mock adding user token
  const postUserToken = ({ tokenId, tokenValue }: FormValues) => {
    tokens?.unshift({ id: nanoid(4), name: tokenId })
    localStorage.setItem('API_TOKENS', JSON.stringify(tokens))
  }

  const onSubmit = (data: FormValues) => {
    postUserToken(data)
    reset({ tokenValue: '' })
  }

  useEffect(() => {
    setTokens(getUserTokens() || [])
  }, [])

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
          error={errors.tokenId}
          onSelect={v => setValue('tokenId', v)}
          props={{
            placeholder: 'Choose service',
            ...register('tokenId', { required: true }),
          }}
        />
      </form>
      {tokens && (
        <ul className={s.tokens}>
          {tokens.map(({ id, name, state }) => (
            <li className={s.token} key={id}>
              <TokenKeyIcon className={s.icon} />
              <div>{name}</div>
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
