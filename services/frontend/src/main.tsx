import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthProvider'
import { PreviewProvider } from './context/PreviewProvider'
import { App } from './App'

async function prepare() {
  if (process.env.NODE_ENV === 'development') {
    return import('./mocks/browser').then(({ worker }) => {
      worker.start()
    })
  }
}

// prepare().then(() => {
  ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <BrowserRouter>
      <AuthProvider>
        <PreviewProvider>
          <App />
        </PreviewProvider>
      </AuthProvider>
    </BrowserRouter>
  )
// })
