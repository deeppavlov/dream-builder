import { App } from 'App'
import { AuthProvider, PreviewProvider, UIOptionsProvider } from 'context'
import { GaContextProvider } from 'context'
import { prepare } from 'mocks/prepare'
import ReactDOM from 'react-dom/client'
import ReactGA from 'react-ga4'
import { QueryClient, QueryClientProvider } from 'react-query'
import { RouterProvider } from 'react-router-dom'
import { YMInitializer } from 'react-yandex-metrika'
import { router } from 'router/Router'
import './i18n'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

if (import.meta.env.MODE !== 'DEV' && import.meta.env.MODE !== 'STAGE') {
  ReactGA.initialize(import.meta.env.VITE_GOOGLE_ANALYTICS)
}

prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <GaContextProvider>
      {import.meta.env.MODE !== 'DEV' && (
        <YMInitializer
          accounts={[Number(import.meta.env.VITE_YANDEX_METRIC_ID)]}
          options={{
            clickmap: true,
            trackLinks: true,
            accurateTrackBounce: true,
            webvisor: true,
          }}
        />
      )}
      <AuthProvider>
        <UIOptionsProvider>
          <PreviewProvider>
            <QueryClientProvider client={queryClient}>
              <App>
                <RouterProvider router={router} />
              </App>
            </QueryClientProvider>
          </PreviewProvider>
        </UIOptionsProvider>
      </AuthProvider>
    </GaContextProvider>
  )
})
