import { getGoogleOAuthURL } from '../../services/getGoogleOAuthUrl'
import Button from '../../ui/Button/Button'

const GoogleSignInButton = () => {
  const handleBtnClick = () => (location.href = getGoogleOAuthURL())

  return (
    <Button theme='secondary' small props={{ onClick: handleBtnClick }}>
      Sign in
    </Button>
  )
}

export default GoogleSignInButton
