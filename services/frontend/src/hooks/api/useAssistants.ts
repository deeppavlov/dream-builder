import { AxiosError } from 'axios'
import { useAuth } from 'context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import store from 'store2'
import { RoutesList } from 'router/RoutesList'
import {
  BotInfoInterface,
  ELOCALES_KEY,
  TDeploymentState,
  TDistVisibility,
} from 'types/types'
import { VISIBILITY_STATUS } from 'constants/constants'
import {
  cloneAssistant,
  createAssistant,
  deleteAssistant,
  editAssistant,
  getAssistant,
  getPrivateAssistants,
  getPublicAssistants,
  publishAssistant,
} from 'api/assistants'
import { deleteAssistants } from 'api/assistants/deleteAssistant'
import { useDeploy } from 'hooks/api/useDeploy'
import { useGaAssistant } from 'hooks/googleAnalytics/useGaAssistant'
import { useGaPublication } from 'hooks/googleAnalytics/useGaPublication'
import { ILocalStorageDist } from 'hooks/useAssistantCleanup'
import { updateAssistantLastUsedDate } from 'utils/updateAssistantLastUsedDate'

interface IChangeVisibility {
  name: string
  newVisibility: TDistVisibility
  inEditor?: boolean
  deploymentState?: TDeploymentState
}

interface IClone {
  name: string
  data: { display_name: string; description: string }
}

interface IRename extends IClone {}

interface IGetDist {
  distName: string | undefined
}

interface IGetDistOptions {
  refetchOnMount?: boolean
  useErrorBoundary?: boolean
  retry?: number
}

interface ICreateAssistantPayload {
  display_name: string
  description: string
  language: ELOCALES_KEY
}
export const useAssistants = () => {
  const auth = useAuth()
  const { name = '' } = useParams()
  const userIsAuthorized = !!auth?.user
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const PUBLIC_DISTS = 'publicDists'
  const PRIVATE_DISTS = 'privateDists'
  const DIST = 'dist'
  const { deploy } = useDeploy()
  const { vaCreated, vaRenamed, vaDeleted, vaChangeDeployState } =
    useGaAssistant()
  const { vaVisibilityChanged } = useGaPublication()

  const fetchPublicDists = () => useQuery(PUBLIC_DISTS, getPublicAssistants)

  const fetchPrivateDists = () =>
    useQuery(
      PRIVATE_DISTS,
      async () => {
        const dists = await getPrivateAssistants()
        const localStorageDists: ILocalStorageDist[] =
          store('myAssistants') || []
        const filteredDists = dists
          .filter(
            dist =>
              !localStorageDists.some(
                storageDist => storageDist.name === dist.name
              )
          )
          .map(({ name }) => ({ name, date: Date.now() }))
        store('myAssistants', [...localStorageDists, ...filteredDists])
        return dists
      },
      { enabled: userIsAuthorized }
    )

  const getDist = ({ distName }: IGetDist, options?: IGetDistOptions) => {
    const isRetry = options?.retry !== undefined

    return useQuery<BotInfoInterface>({
      queryKey: [DIST, distName],
      queryFn: () => getAssistant(distName!),
      onError: error => {
        if (error instanceof AxiosError && error?.response?.status === 401) {
          navigate('/')
        }
      },
      refetchOnMount: Boolean(options?.refetchOnMount),
      refetchOnWindowFocus: true,
      initialData: () => getCachedDist(distName!),
      useErrorBoundary: options?.useErrorBoundary,
      retry: isRetry ? options?.retry : 0,
      enabled: !!distName,
    })
  }

  const rename = useMutation({
    mutationFn: ({ name, data }: IRename) => editAssistant(name, data),
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries([DIST, name])
      queryClient
        .invalidateQueries([PRIVATE_DISTS])
        .finally(() => updateCachedDist(name))
      vaRenamed()
      updateAssistantLastUsedDate(name)
    },
  })

  const clone = useMutation({
    mutationFn: ({ name, data }: IClone) => cloneAssistant(name, data),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.skills, { name: dist.name }))
      vaCreated()
    },
  })

  const create = useMutation({
    onMutate: () => {},
    mutationFn: (createPayload: ICreateAssistantPayload) =>
      createAssistant(createPayload),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.skills, { name: dist.name }))
      vaCreated()
    },
  })

  const deleteDist = useMutation({
    mutationFn: (name: string) => deleteAssistant(name),
    onSuccess: (_, name) => {
      queryClient.invalidateQueries([PRIVATE_DISTS]).finally(() => {
        updateCachedDist(name)
      }),
        queryClient.invalidateQueries([PUBLIC_DISTS]).then(() => {
          updateCachedDist(name)
        })
      vaDeleted()

      const localStorageDists: ILocalStorageDist[] = store('myAssistants') || []
      const remainingLocalStorageDists = localStorageDists.filter(
        dist => dist.name !== name
      )
      store('myAssistants', remainingLocalStorageDists)
    },
  })

  const deleteDists = useMutation({
    mutationFn: async (names: string[]) => {
      await deleteAssistants(names)
      await queryClient.invalidateQueries([PRIVATE_DISTS])
      await queryClient.invalidateQueries([PUBLIC_DISTS])
    },

    onSuccess: (_, names) => {
      names.includes(name) && navigate(RoutesList.start)
      const localStorageDists: ILocalStorageDist[] = store('myAssistants') || []
      const remainingLocalStorageDists = localStorageDists.filter(
        dist => !names.includes(dist.name)
      )
      store('myAssistants', remainingLocalStorageDists)
    },
  })

  const changeVisibility = useMutation({
    onMutate: ({ name, newVisibility, deploymentState }) => {
      if (newVisibility !== VISIBILITY_STATUS.PRIVATE && !deploymentState) {
        deploy.mutateAsync(name).then(() => vaChangeDeployState('VA_Deployed'))
      }
    },
    mutationFn: ({ name, newVisibility }: IChangeVisibility) =>
      publishAssistant(name, newVisibility),
    onSuccess: (_, { name, newVisibility, inEditor }) => {
      vaVisibilityChanged(newVisibility)
      const requestToPublicTemplate =
        newVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

      if (!requestToPublicTemplate)
        queryClient.invalidateQueries([PUBLIC_DISTS])
      if (inEditor) queryClient.invalidateQueries([DIST, name])
      queryClient
        .invalidateQueries([PRIVATE_DISTS])
        .finally(() => updateCachedDist(name))
      updateAssistantLastUsedDate(name)
    },
  })

  const updateCachedDist = (name: string) => {
    const privateDist =
      (
        queryClient.getQueryData<BotInfoInterface[] | undefined>([
          PRIVATE_DISTS,
        ]) || []
      ).find(dist => dist?.name === name) ?? null

    const isCachedDist = queryClient.getQueryData([DIST, name]) !== undefined
    if (isCachedDist)
      queryClient.setQueryData<BotInfoInterface | null>(
        [DIST, name],
        privateDist
      )
  }

  const refetchDist = useMutation({
    mutationFn: (name: string) => getAssistant(name),
    onSuccess: (dist, name) => {
      queryClient.setQueryData<BotInfoInterface | null>([DIST, name], dist)
      refetchDist
    },
  })

  const getCachedDist = (name: string) => {
    const cachedDist = queryClient.getQueryData<BotInfoInterface | undefined>([
      DIST,
      name,
    ])
    const isCachedDist = cachedDist !== undefined && cachedDist !== null

    if (isCachedDist) return cachedDist

    const publicDists =
      queryClient.getQueryData<BotInfoInterface[] | undefined>([
        PUBLIC_DISTS,
      ]) || []
    const privateDists =
      queryClient.getQueryData<BotInfoInterface[] | undefined>([
        PRIVATE_DISTS,
      ]) || []
    const result = [...publicDists, ...privateDists]?.find(
      dist => dist?.name === name
    )

    return result
  }

  return {
    fetchPublicDists,
    fetchPrivateDists,
    getDist,
    changeVisibility,
    rename,
    create,
    clone,
    deleteDist,
    deleteDists,
    refetchDist,
  }
}
