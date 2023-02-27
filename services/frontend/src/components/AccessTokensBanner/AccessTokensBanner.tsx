import classNames from 'classnames/bind'
import { ReactComponent as TokenKeyIcon } from '@assets/icons/token_key.svg'
import { Input } from '../../ui/Input/Input'
import { Wrapper } from '../../ui/Wrapper/Wrapper'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import s from './AccessTokensBanner.module.scss'

interface BannerProps {}

const mockSkillModels = ['ChatGPT', 'GPT-3', 'GPT-J', 'Bloom']
const mockTokens = [
  { id: '0', name: 'Open AI', state: 'not-valid' },
  { id: '1', name: 'GNews API', state: 'validate' },
  { id: '2', name: 'GNews API', state: 'validating' },
  { id: '3', name: 'GNews API', state: 'valid' },
]

export const AccessTokensBanner = (props: BannerProps) => {
  let cx = classNames.bind(s)

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
      <form className={s.add}>
        <Input
          label='Add a new personal access token:'
          props={{ placeholder: 'Assistive text' }}
        />
        <SkillDropboxSearch
          label='Choose service:'
          list={mockSkillModels}
          props={{ placeholder: 'Choose model' }}
        />
      </form>
      <ul className={s.tokens}>
        {mockTokens.map(({ id, name, state }) => (
          <li className={s.token}>
            <TokenKeyIcon className={s.icon} />
            <div>{name}</div>
            <div className={cx('state', state)}>
              <span>{state.replace(/-/g, ' ')}</span>
            </div>
            <button className={s.remove}>Remove</button>
          </li>
        ))}
      </ul>
    </Wrapper>
  )
}
