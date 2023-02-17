import { Router } from './router/Router'
import Modal from 'react-modal'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ErrorMessageModal } from './components/ErrorMessageModal/ErrorMessageModal'

Modal.setAppElement('#root')
const queryClient = new QueryClient()
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='app'>
        <Router />
        <ErrorMessageModal />
      </div>
    </QueryClientProvider>
  )
}
