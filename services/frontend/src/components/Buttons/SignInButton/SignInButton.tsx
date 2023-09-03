import { useTranslation } from 'react-i18next'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'

const SignInButton = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'topbar.btns' })

  const handleBtnClick = () => trigger('SignInModal', {})

  return (
    <Button theme='secondary' small props={{ onClick: handleBtnClick }}>
      {t('sign_in')}
    </Button>
  )
}

export default SignInButton
