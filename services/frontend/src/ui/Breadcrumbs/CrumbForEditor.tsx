import { Link } from 'react-router-dom'
import { usePreview } from '../../context/PreviewProvider'
import { RoutesList } from '../../router/RoutesList'

export const CrumbForEditor = () => {
  const { isPreview } = usePreview()
  return (
    <Link to={RoutesList.start}>
      {isPreview ? 'Public ' : 'Your '}Virtual Assistants & Chatbots
    </Link>
  )
}
