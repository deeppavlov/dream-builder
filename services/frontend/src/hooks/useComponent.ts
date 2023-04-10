import { useMutation, useQueryClient } from 'react-query'
import { addComponent } from '../services/addComponent'
import { deleteComoponent } from '../services/deleteComponent'

export const useComponent = () => {
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
  return { addSkill, deleteComponent }
}
