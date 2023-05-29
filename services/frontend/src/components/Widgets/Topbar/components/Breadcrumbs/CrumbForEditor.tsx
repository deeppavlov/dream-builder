import { Link } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { usePreview } from 'context/PreviewProvider'

export const CrumbForEditor = () => {
  const { isPreview } = usePreview()
  return (
    <Link to={isPreview ? RoutesList.botsAll : RoutesList.yourBots}>
      {isPreview ? 'Public Templates' : 'Your Assistants'}
    </Link>
  )
}
