import { getGoogleOAuthURL } from 'api/user/getGoogleOAuthUrl'
import { saveBeforeLoginLocation } from 'utils/beforeSignInManager'

export const login = () => {
  saveBeforeLoginLocation()
  location.href = getGoogleOAuthURL()
}
