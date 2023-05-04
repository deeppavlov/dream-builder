import { useMutation, useQuery, useQueryClient } from 'react-query'
import { addComponent as postComponent } from '../services/addComponent'
import {
  createComponent,
  InfoForNewComponent,
} from '../services/createComponent'
import { deleteComoponent } from '../services/deleteComponent'
import { editComponent } from '../services/editComponent'
import { getComponent as fetchComponent } from '../services/getComponent'
import { getComponents } from '../services/getComponents'
import {
  IPatchComponentParams,
  patchComponent,
} from '../services/patchComponent'
import {
  IStackElement,
  LM_Service,
  StackType,
  TComponents,
} from '../types/types'

interface IGet {
  distName: string
  id: number
  type: StackType
}

interface IAdd {
  distName: string
  id: number
  type: StackType
}

interface IDelete extends IAdd {}

interface ICreate {
  distName: string
  data: InfoForNewComponent
  type: StackType
}

interface IEdit {
  distName: string
  id: number
  type: StackType
  data: IStackElement
}

interface ICachedComponent {
  distName: string
  id: number
  type: StackType
  data: IStackElement
}

interface IUpdate extends IPatchComponentParams {
  distName: string
  type: StackType
  lm_service: LM_Service
}

export const useComponent = () => {
  const queryClient = useQueryClient()
  const ALL_COMPONENTS = 'all_components'
  const COMPONENT = 'component'

  const getAllComponents = (distName: string) =>
    useQuery<TComponents>(
      [ALL_COMPONENTS, distName],
      () => getComponents(distName),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: distName?.length! > 0,
        initialData: () => getAllFetchedComponents(distName),
      }
    )

  const getComponent = ({ distName, id, type }: IGet) =>
    useQuery([COMPONENT, distName, id], () => fetchComponent(id), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      initialData: () => getFetchedComponent({ distName, id, type }),
    })

  const addComponentToDist = useMutation({
    mutationFn: ({ distName, id }: IAdd) => postComponent(distName, id),
    onSuccess: (data: IStackElement, { id, distName, type }) => {
      updateCachedComponent({ id, distName, type, data })
    },
  })

  const deleteComponent = useMutation({
    mutationFn: ({ distName, id }: IDelete) => deleteComoponent(distName, id),
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_COMPONENTS)
    },
  })

  const create = useMutation({
    mutationFn: ({ data }: ICreate) => createComponent(data),
    onSuccess: ({ id }: IStackElement, { distName, type }) => {
      addComponentToDist.mutateAsync({ distName, id: id, type })
    },
  })

  const edit = useMutation({
    mutationFn: ({ id, data }: IEdit) => editComponent(data, id),
    onSuccess: (data: IStackElement, { id, distName, type }) => {
      updateCachedComponent({ id, distName, type, data })
    },
  })

  const updateComponent = useMutation({
    mutationFn: (variables: IUpdate) => patchComponent(variables),
    onSuccess: (
      data: IStackElement,
      { component_id, distName, type, lm_service }
    ) => {
      //fix lm_service on patchComponent endpoint not return from backend
      updateCachedComponent({
        id: component_id,
        distName,
        type,
        data: { ...data, lm_service },
      })
    },
  })

  const updateCachedComponent = ({
    distName,
    id,
    data,
    type,
  }: ICachedComponent) => {
    const isCachedComponent =
      queryClient.getQueryData([COMPONENT, distName, id]) !== undefined

    queryClient.setQueryData<TComponents | undefined>(
      [ALL_COMPONENTS, distName],
      old => {
        if (old) {
          const oldIndex = old[type].findIndex(
            ({ component_id }) => component_id === id
          )
          const isExistOld = oldIndex > -1
          const oldComponent = old[type][oldIndex]
          const newState = old[type]

          if (isExistOld) {
            newState[oldIndex] = Object.assign({}, oldComponent, data)
          } else {
            newState.push(data)
          }

          return Object.assign({}, old, { [type]: newState })
        }
      }
    )

    if (isCachedComponent) {
      queryClient.setQueryData<IStackElement | undefined>(
        [COMPONENT, distName, id],
        old => old && Object.assign({}, old, data)
      )
    }
  }

  const getAllFetchedComponents = (distName: string) =>
    queryClient.getQueryData<TComponents | undefined>([
      ALL_COMPONENTS,
      distName,
    ])

  const getFetchedComponent = ({ distName, id, type }: IGet) => {
    const component = queryClient.getQueryData<IStackElement | undefined>([
      COMPONENT,
      distName,
      id,
    ])
    const allComponents =
      queryClient.getQueryData<TComponents | undefined>([
        ALL_COMPONENTS,
        distName,
      ])?.[type] || []
    const result = [component, ...allComponents]?.find(
      component => component?.component_id === id
    )

    return result
  }

  return {
    getAllComponents,
    getComponent,
    updateComponent,
    addComponentToDist,
    deleteComponent,
    create,
    edit,
  }
}
