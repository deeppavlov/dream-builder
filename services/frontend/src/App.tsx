import Modal from 'react-modal'
import { ErrorMessageModal } from './components/ErrorMessageModal/ErrorMessageModal'

Modal.setAppElement('#root')

export const App = ({ children }: any) => {
  return (
    <div className='app'>
      <ErrorMessageModal />
      {children}
    </div>
  )
}
