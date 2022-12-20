import { Router } from './Router/Router'
import Modal from 'react-modal'
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

Modal.setAppElement('#root')
const queryClient = new QueryClient()
export const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className='app'>
        <Router />
      </div>
    </QueryClientProvider>
  )
}
