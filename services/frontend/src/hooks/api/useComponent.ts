import { useMutation, useQueries, useQuery, useQueryClient } from 'react-query'
import {
  BotInfoInterface,
  ICloneComponent,
  ISkill,
  IStackElement,
  LM_Service,
  LanguageModel,
  StackType,
  TComponents,
} from 'types/types'
import {
  addComponent,
  cloneComponent,
  createComponent,
  deleteComoponent,
  editComponent,
  getComponent as fetchComponent,
  getComponents,
  getComponentsGroup,
  patchComponent,
} from 'api/components'
import { IPatchComponentParams } from 'api/components/patchComponent'
import { useGaSkills } from 'hooks/googleAnalytics/useGaSkills'
import getTokensLength from 'utils/getTokensLength'

interface IGet {
  distName: string
  id: number
  type: StackType
}

interface IOptions {
  refetchOnMount?: boolean
}

interface IAdd {
  distName: string
  id: number
  type: StackType
}

interface IDelete extends IAdd {
  component_id: number
}

interface IEdit {
  distName: string
  component_id: number
  type: StackType
  data: { display_name: string; description: string }
}

interface ICachedComponent {
  distName: string
  id: number
  type: StackType
  data: IStackElement | null
}

interface IUpdate extends IPatchComponentParams {
  distName: string
  type: StackType
  lm_service: LM_Service
}

interface IGetGroup {
  distName: string
  group: StackType
  component_type?: string
  author_id?: number
}

export const useComponent = () => {
  const queryClient = useQueryClient()
  const ALL_COMPONENTS = 'all_components'
  const COMPONENT = 'component'

  const { skillRenamed, skillDeleted, skillAdded } = useGaSkills()

  const addTokenCount = (data: TComponents) => {
    data.skills.forEach((el: ISkill) => {
      if (el.display_name !== 'Dummy Skill') {
        const lmModel = el.lm_service?.name as LanguageModel | undefined
        el.count_token = getTokensLength(lmModel, el.prompt ?? '')
      }
    })
  }

  const getAllComponents = (distName: string, options?: IOptions) =>
    useQuery<TComponents>(
      [ALL_COMPONENTS, distName],
      async () => {
        const data = await getComponents(distName)
        addTokenCount(data)
        return data
      },
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: distName?.length! > 0,
        initialData: () =>
          getAllFetchedComponents(distName, ALL_COMPONENTS) as TComponents,
        ...options,
      }
    )

  const getAllComponentsArr = (sortedDists: BotInfoInterface[]) => {
    const res = useQueries(
      sortedDists.map((el: BotInfoInterface) => {
        return {
          queryKey: ['skill', el.name],
          queryFn: async () => {
            const data = await getComponents(el.name, el)
            addTokenCount(data)
            return data
          },
        }
      })
    )
    return res
  }

  const getGroupComponents = (
    { distName, group, component_type, author_id }: IGetGroup,
    { enabled }: { enabled?: boolean }
  ) =>
    useQuery<IStackElement[]>(
      [group, distName],
      () => getComponentsGroup({ group, component_type, author_id }),
      {
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        enabled: enabled ?? distName?.length! > 0,
        initialData: () =>
          getAllFetchedComponents(distName, group) as IStackElement[],
      }
    )

  const getComponent = ({ distName, id, type }: IGet, options?: IOptions) =>
    useQuery([COMPONENT, distName, id], () => fetchComponent(id), {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      initialData: () => getFetchedComponent({ distName, id, type }),
      ...options,
    })

  const addComponentToDist = useMutation({
    mutationFn: ({ distName, id }: IAdd) => addComponent(distName, id),
    onSuccess: () => {
      queryClient.invalidateQueries([ALL_COMPONENTS])
    },
  })

  const deleteComponent = useMutation({
    mutationFn: ({ distName, id }: IDelete) => deleteComoponent(distName, id),
    onSuccess: (_, { type, distName, component_id }) => {
      skillDeleted()
      queryClient.invalidateQueries([ALL_COMPONENTS])
      queryClient.invalidateQueries([type, distName])
      queryClient.invalidateQueries(['skill', distName])
      updateCachedComponent({ distName, id: component_id, type, data: null })
    },
  })
  const create = useMutation({
    onMutate: () => {
      // console.log('data = ', data)
    },
    mutationFn: ({ data }: any) => createComponent(data),
    onSuccess: (skill: IStackElement, { distName, type }) => {
      // console.log('id = ', id)
      addComponentToDist.mutateAsync({ distName, id: skill.id, type })
      skillAdded(skill)
    },
  })
  const clone = useMutation({
    onMutate: (data: ICloneComponent) => {
      console.log('data = ', data.skill)
    },
    mutationFn: (data: ICloneComponent) =>
      cloneComponent(data.skill.id, {
        display_name: data.skill.display_name,
        description: data.skill.description,
        prompt: data.skill.prompt!,
      }),
    onSuccess: ({ id }: IStackElement, { distName, type }) => {
      console.log('data = ', id, distName, type)
      addComponentToDist.mutateAsync({ distName, id: id, type })
    },
  })

  const edit = useMutation({
    mutationFn: ({ component_id, data }: IEdit) =>
      editComponent(data, component_id),
    onSuccess: (data: IStackElement, { component_id, distName, type }) => {
      skillRenamed(data)
      queryClient.invalidateQueries([ALL_COMPONENTS])
      updateCachedComponent({ id: component_id, distName, type, data })
    },
  })

  const updateComponent = useMutation({
    mutationFn: (variables: IUpdate) => patchComponent(variables),
    onSuccess: (
      data: IStackElement,
      { component_id, distName, lm_service, type }
    ) => {
      //fix lm_service on patchComponent endpoint not return from backend
      queryClient.invalidateQueries(['skill', distName])
      updateCachedComponent({
        id: component_id,
        distName,
        type,
        data: { ...data, lm_service } as IStackElement,
      })
    },
  })

  const updateCachedComponent = ({
    distName,
    id,
    type,
    data,
  }: ICachedComponent) => {
    const isCachedComponent =
      queryClient.getQueryData([COMPONENT, distName, id]) !== undefined

    if (isCachedComponent) {
      queryClient.setQueryData<IStackElement | undefined>(
        [COMPONENT, distName, id],
        old => {
          const isComparable = old && data

          if (!isComparable) return undefined
          return Object.assign({}, old, data)
        }
      )
    }

    queryClient.setQueryData<TComponents | undefined>(
      [ALL_COMPONENTS, distName],
      old => {
        if (old) {
          const oldIndex = old[type].findIndex(el => el.component_id === id)
          const isOldExist = oldIndex > -1
          const oldComponent = old[type][oldIndex]
          const newState = old[type]

          if (isOldExist)
            newState[oldIndex] = Object.assign({}, oldComponent, data)

          return Object.assign({}, old, { [type]: newState })
        }
      }
    )
  }

  const getAllFetchedComponents = (
    distName: string,
    group: StackType | typeof ALL_COMPONENTS
  ) =>
    queryClient.getQueryData<TComponents | IStackElement[] | undefined>([
      group,
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
    const groupComponents =
      queryClient.getQueryData<IStackElement[] | undefined>([type, distName]) ||
      []
    const result = [component, ...allComponents, ...groupComponents]?.find(
      el => (el?.component_id ?? el?.id) === id
    )

    return result
  }

  return {
    getAllComponents,
    getGroupComponents,
    getComponent,
    updateComponent,
    addComponentToDist,
    deleteComponent,
    clone,
    create,
    edit,
    getAllComponentsArr,
  }
}
