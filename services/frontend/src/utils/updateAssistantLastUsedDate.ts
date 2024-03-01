import store from 'store2'
import { ILocalStorageDist } from 'hooks/useAssistantCleanup'

export const updateAssistantLastUsedDate = (assistantName: string) => {
  const localStorageDists: ILocalStorageDist[] = store('myAssistants') || []
  const updatedLocalStorageDists = localStorageDists.map(d => {
    if (d.name === assistantName) {
      return { name: d.name, date: Date.now() }
    }
    return d
  })
  store('myAssistants', updatedLocalStorageDists)
}
