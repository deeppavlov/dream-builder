import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'
import { App } from './App'
import { AuthProvider } from './context/AuthProvider'
import { DisplayProvider } from './context/DisplayContext'
import { PreviewProvider } from './context/PreviewProvider'
import { prepare } from './mocks/prepare'
import { router } from './router/Router'

const queryClient = new QueryClient()

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <AuthProvider>
      <DisplayProvider>
        <PreviewProvider>
          <QueryClientProvider client={queryClient}>
            <App>
              <RouterProvider router={router} />
            </App>
          </QueryClientProvider>
        </PreviewProvider>
      </DisplayProvider>
    </AuthProvider>
  )
})
