export async function prepare() {
  if (process.env.NODE_ENV === 'development') {
    return import('./mocks/browser').then(({ worker }) => {
      worker.start()
    })
  }
}