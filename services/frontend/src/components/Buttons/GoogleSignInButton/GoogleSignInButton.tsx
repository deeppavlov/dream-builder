import { useTranslation } from 'react-i18next'
import { login } from 'api/user'
import { Button } from 'components/Buttons'

const GoogleSignInButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'topbar.btns' })

  const handleBtnClick = () => login()

  return (
    <Button theme='secondary' small props={{ onClick: handleBtnClick }}>
      {t('sign_in')}
    </Button>
  )
}

export default GoogleSignInButton
