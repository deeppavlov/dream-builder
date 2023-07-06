import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { usePreview } from 'context/PreviewProvider'

export const CrumbForEditor = () => {
  const { isPreview } = usePreview()
  const { t } = useTranslation('translation', { keyPrefix: 'breadcrumbs' })

  return (
    <Link to={isPreview ? RoutesList.botsAll : RoutesList.yourBots}>
      {isPreview ? t('public_templates') : t('your_assistants')}
    </Link>
  )
}
