import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './services/AuthProvider'
import { App } from './App'

function prepare() {
  if (process.env.NODE_ENV === 'development') {
    import('./mocks/browser').then(({ worker }) => {
      worker.start()
    })
  }
  return Promise.resolve()
}

prepare().then(() => {
  setTimeout(() => {
    ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    )
  }, 100)
})
