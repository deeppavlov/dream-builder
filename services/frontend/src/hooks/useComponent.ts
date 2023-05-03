import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import { addComponent } from '../services/addComponent'
import {
  createComponent,
  InfoForNewComponent,
} from '../services/createComponent'
import { deleteComoponent } from '../services/deleteComponent'
import { ComponentData, editComponent } from '../services/editComponent'
import { getComponents } from '../services/getComponents'
import { ISkill } from '../types/types'

export const useComponent = (distName: string) => {
  const { name: nameFromURL } = useParams()
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
      const id = data?.id
      addSkill.mutateAsync({ distName: nameFromURL || '', id }).then(() => {
        queryClient.invalidateQueries('components')
      })
    },
  })
  const edit = useMutation({
    mutationFn: (variables: { data: ComponentData; id: number }) => {
      return editComponent(variables?.data, variables?.id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('components')
    },
  })

  const {
    isLoading: isComponentsLoading,
    error: componentsError,
    data: components,
  } = useQuery(
    ['components', nameFromURL],
    () => getComponents(nameFromURL || distName),
    {
      refetchOnWindowFocus: false,
      enabled: nameFromURL?.length! > 0 || distName.length > 0,
    }
  )
  return {
    components,
    isComponentsLoading,
    componentsError,
    addSkill,
    deleteComponent,
    create,
    edit,
  }
}
