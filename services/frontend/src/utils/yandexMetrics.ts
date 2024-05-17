import ym from 'react-yandex-metrika'

export const yandexMetrics = (methodName: string, ...args: string[]) => {
  if (import.meta.env.MODE === 'DEV') return

  ym(methodName, ...args)
}
