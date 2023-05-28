import { login } from 'context/AuthProvider'
import { Button } from 'components/Buttons'

const GoogleSignInButton = () => {
  const handleBtnClick = () => login()

  return (
    <Button theme='secondary' small props={{ onClick: handleBtnClick }}>
      Sign in
    </Button>
  )
}

export default GoogleSignInButton
