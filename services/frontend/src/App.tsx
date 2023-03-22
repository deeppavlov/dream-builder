import Modal from 'react-modal'

Modal.setAppElement('#root')

export const App = ({ children }: any) => {
  return <div className='app'>{children}</div>
}
