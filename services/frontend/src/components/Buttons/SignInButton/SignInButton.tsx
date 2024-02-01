import { useTranslation } from 'react-i18next'
import { login } from 'api/user'
import { Button } from 'components/Buttons'

const SignInButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'topbar.btns' })

  return (
    <Button theme='secondary' small props={{ onClick: login.gitHub }}>
      {t('sign_in')}
    </Button>
  )
}

export default SignInButton
