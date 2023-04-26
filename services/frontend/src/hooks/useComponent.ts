import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import { addComponent } from '../services/addComponent'
import {
  createComponent,
  InfoForNewComponent,
} from '../services/createComponent'
import { deleteComoponent } from '../services/deleteComponent'
import { ComponentData, editComponent } from '../services/editComponent'
import { getComponents } from '../services/getComponents'
import { ISkill } from '../types/types'

export const useComponent = () => {
  const { state } = useLocation()
  const queryClient = useQueryClient()
  const location = useLocation()
  const nameFromURL = location?.pathname?.substring(1)

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
    ['components', state?.distName],
    () => getComponents(state?.distName! || nameFromURL),
    {
      refetchOnWindowFocus: false,
      enabled: state?.distName?.length! > 0 || nameFromURL.length > 0,
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
