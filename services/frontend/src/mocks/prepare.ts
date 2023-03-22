export async function prepare() {
  if (import.meta.env.MODE === 'msw') {
    return import('./browser').then(({ worker }) => {
      worker.start()
    })
  }
}
