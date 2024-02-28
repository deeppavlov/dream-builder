import { useEffect } from 'react'
import { useQueryClient } from 'react-query'
import store from 'store2'
import { BotInfoInterface } from 'types/types'
import { PRIVATE_DISTS } from 'constants/constants'
import { useAssistants } from './api'

export interface ILocalStorageDist {
  name: string
  date: number
}

export const useAssistantCleanup = () => {
  const queryClient = useQueryClient()
  const { deleteDists } = useAssistants()

  useEffect(() => {
    const cleanUpExpiredAssistants = async () => {
      const privateDists: BotInfoInterface[] =
        queryClient.getQueryData(PRIVATE_DISTS) || []
      const privateDistNames = privateDists.map(d => d.name)
      const localStorageDists: ILocalStorageDist[] = store('myAssistants') || []

      const expiredDistNames = localStorageDists
        .filter(d => Date.now() - d.date > 1200000) // 20 minutes
        .map(d => d.name)
        .filter(name => privateDistNames?.includes(name))

      if (expiredDistNames.length > 0) {
        try {
          await deleteDists.mutateAsync(expiredDistNames)
        } catch (e) {
          store(
            'myAssistants',
            localStorageDists.filter(d => privateDistNames?.includes(d.name))
          )
        }
      }
    }

    cleanUpExpiredAssistants()
    const cleanupInterval = setInterval(cleanUpExpiredAssistants, 300000) // 5 minutes

    return () => clearInterval(cleanupInterval)
  }, [])

  return {}
}
