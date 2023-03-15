import { login } from '../../context/AuthProvider'
import Button from '../../ui/Button/Button'

const GoogleSignInButton = () => {
  const handleBtnClick = () => login()

  return (
    <Button theme='secondary' small props={{ onClick: handleBtnClick }}>
      Sign in
    </Button>
  )
}

export default GoogleSignInButton
