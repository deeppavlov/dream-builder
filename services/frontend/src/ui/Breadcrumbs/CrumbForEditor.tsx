import { Link } from 'react-router-dom'
import { usePreview } from '../../Context/PreviewProvider'
import { RoutesList } from '../../Router/RoutesList'

export const CrumbForEditor = () => {
  const { isPreview } = usePreview()
  return (
    <Link to={RoutesList.start}>
      {isPreview ? 'Public ' : 'Your '}Virtual Assistants & Chatbots
    </Link>
  )
}
