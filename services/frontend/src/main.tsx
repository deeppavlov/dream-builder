import ReactDOM from 'react-dom/client'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './Context/AuthProvider'
import { QueryClient, QueryClientProvider } from 'react-query'
import { PreviewProvider } from './Context/PreviewProvider'
import { router } from './Router/Router'
import { App } from './App'
import { prepare } from './mocks/prepare'

const queryClient = new QueryClient()

prepare().then(() => {
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
})
