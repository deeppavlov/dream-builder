import ym from 'react-yandex-metrika'

export const yandexMetrics = (methodName: string, ...args: string[]) => {
  const mode = import.meta.env.MODE
  if (mode === 'DEV' || mode === 'STAGE') return

  ym(methodName, ...args)
}
