import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { App } from './App'
import { PreviewProvider } from './context/PreviewProvider'

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
          <PreviewProvider>
            <App />
          </PreviewProvider>
        </AuthProvider>
      </BrowserRouter>
    )
  }, 100)
})
