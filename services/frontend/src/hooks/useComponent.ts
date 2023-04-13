import { useMutation, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import { addComponent } from '../services/addComponent'
import {
  createComponent,
  InfoForNewComponent,
} from '../services/createComponent'
import { deleteComoponent } from '../services/deleteComponent'
import { ISkill } from '../types/types'

export const useComponent = () => {
  const { state } = useLocation()
  const queryClient = useQueryClient()
  const addSkill = useMutation({
    mutationFn: (variables: { distName: string; id: number }) => {
      return addComponent(variables.distName, variables.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('components')
    },
  })

  const deleteComponent = useMutation({
    mutationFn: (variables: { distName: string; id: number }) => {
      return deleteComoponent(variables.distName, variables.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('components')
    },
  })

  const create = useMutation({
    mutationFn: (info: InfoForNewComponent) => {
      return createComponent(info)
    },
    onSuccess: (data: ISkill) => {
      const distName = state?.distName
      const id = data?.id
      addSkill.mutateAsync({ distName, id }).then(() => {
        queryClient.invalidateQueries('components')
      })
    },
  })
  return { addSkill, deleteComponent, create }
}
