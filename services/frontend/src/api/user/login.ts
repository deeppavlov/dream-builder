import { getGoogleOAuthURL } from 'api/user/getGoogleOAuthUrl'
import { saveBeforeLoginLocation } from 'utils/beforeSignInManager'
import { getGitHubOAuthURL } from './getGithubOAuthURL'

const loginGoogle = () => {
  saveBeforeLoginLocation()
  location.href = getGoogleOAuthURL()
}

const loginGitHub = () => {
  saveBeforeLoginLocation()
  location.href = getGitHubOAuthURL()
}

export const login = {
  gitHub: loginGitHub,
  google: loginGoogle,
}
