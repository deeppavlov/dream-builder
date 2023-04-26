import { Link } from 'react-router-dom'
import { usePreview } from '../../context/PreviewProvider'
import { RoutesList } from '../../router/RoutesList'

export const CrumbForEditor = () => {
  const { isPreview } = usePreview()
  return (
    <Link to={isPreview ? RoutesList.botsAll : RoutesList.yourBots}>
      {isPreview ? 'Assistant Templates' : 'Your Assistants'}
    </Link>
  )
}
