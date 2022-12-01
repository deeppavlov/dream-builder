import { Router } from './Router/Router'
import Modal from 'react-modal'

Modal.setAppElement('#root')

export const App = () => {
  return (
    <div className='app'>
      <Router />
    </div>
  )
}
