import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PreviewProvider } from './context/PreviewProvider'
import { router } from './router/Router'
import { App } from './App'
import { prepare } from './mocks/prepare'

const queryClient = new QueryClient()

//  prepare().then(() => {
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <AuthProvider>
    <PreviewProvider>
      <QueryClientProvider client={queryClient}>
        <App>
          <RouterProvider router={router} />
        </App>
      </QueryClientProvider>
    </PreviewProvider>
  </AuthProvider>
)
