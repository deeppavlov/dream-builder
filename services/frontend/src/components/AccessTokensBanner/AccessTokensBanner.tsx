import { useState } from 'react'
import classNames from 'classnames/bind'
import { useForm } from 'react-hook-form'
import { nanoid } from 'nanoid'
import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './AccessTokensBanner.module.scss'

type TTokenState = 'validate' | 'not-valid' | 'validating' | 'valid'

interface IToken {
  id: string
  name: string
  state: TTokenState
}

interface BannerProps {}

export const AccessTokensBanner = (props: BannerProps) => {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' })
  const [TOKEN_ID, MODEL_ID] = ['token', 'model']
  const mockSkillModels = ['ChatGPT', 'GPT-3', 'GPT-J', 'Bloom']
  const mockTokens: IToken[] = [
    { id: '0', name: 'Open AI', state: 'not-valid' },
    { id: '1', name: 'GNews API', state: 'validate' },
    { id: '2', name: 'GNews API', state: 'validating' },
    { id: '3', name: 'GNews API', state: 'valid' },
  ]
  const [tokens, setTokens] = useState<IToken[] | null>(mockTokens)

  let cx = classNames.bind(s)

  const setTokenState = (id: string, state: TTokenState) => {
    setTokens(prev =>
      prev
        ? prev.map(token => {
            if (token.id === id) {
              return { ...token, ...{ state } }
            }
            return token
          })
        : null
    )
  }

  const handleValidateBtnClick = (id: string) => {
    setTokenState(id, 'validating')

    // Mock Validating timeout
    setTimeout(() => {
      const validationState: TTokenState = ['valid', 'not-valid'][
        Math.floor(Math.random() * 2)
      ] as TTokenState

      setTokenState(id, validationState)
    }, 600)
  }

  const handleRemoveBtnClick = (id: string) => {
    setTokens(prev => (prev ? prev.filter(token => token.id !== id) : null))
  }

  const onSubmit = (data: any) => {
    tokens?.unshift({ id: nanoid(4), name: data.token, state: 'validate' })

    reset({
      [TOKEN_ID]: '',
    })
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
          error={errors[TOKEN_ID]}
          props={{
            placeholder: 'Assistive text',
            ...register(TOKEN_ID, { required: true }),
          }}
        />
        <SkillDropboxSearch
          label='Choose service:'
          list={mockSkillModels}
          error={errors[MODEL_ID]}
          props={{
            placeholder: 'Choose model',
            ...register(MODEL_ID, { required: true }),
          }}
        />
      </form>
      {tokens && (
        <ul className={s.tokens}>
          {tokens.map(({ id, name, state }) => (
            <li className={s.token} key={id}>
              <TokenKeyIcon className={s.icon} />
              <div>{name}</div>
              <div className={cx('state', state)}>
                {state === 'validate' ? (
                  <button
                    className={s.validate}
                    onClick={() => handleValidateBtnClick(id)}>
                    {state.replace(/-/g, ' ')}
                  </button>
                ) : (
                  <span>{state.replace(/-/g, ' ')}</span>
                )}
              </div>
              <button
                className={s.remove}
                onClick={() => handleRemoveBtnClick(id)}>
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </Wrapper>
  )
}
