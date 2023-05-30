import { saveBeforeLoginLocation } from 'utils/beforeSignInManager'
import { getGoogleOAuthURL } from './getGoogleOAuthUrl'

export const login = () => {
  saveBeforeLoginLocation()
  location.href = getGoogleOAuthURL()
}
