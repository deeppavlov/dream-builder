import { getGoogleOAuthURL } from 'api/user/getGoogleOAuthUrl'
import { saveBeforeLoginLocation } from 'utils/beforeSignInManager'
import { setAuthType } from 'utils/localStorageAuth'
import { getGitHubOAuthURL } from './getGithubOAuthURL'

const loginGoogle = () => {
  saveBeforeLoginLocation()
  setAuthType('google')
  location.href = getGoogleOAuthURL()
}

const loginGitHub = () => {
  saveBeforeLoginLocation()
  setAuthType('github')
  location.href = getGitHubOAuthURL()
}

export const login = {
  gitHub: loginGitHub,
  google: loginGoogle,
}
