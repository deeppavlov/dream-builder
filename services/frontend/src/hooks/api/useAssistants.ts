import { useAuth } from 'context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
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
import { useDeploy } from 'hooks/api/useDeploy'

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
  const userIsAuthorized = !!auth?.user
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const PUBLIC_DISTS = 'publicDists'
  const PRIVATE_DISTS = 'privateDists'
  const DIST = 'dist'
  const { deploy } = useDeploy()

  const fetchPublicDists = () => useQuery(PUBLIC_DISTS, getPublicAssistants)

  const fetchPrivateDists = () =>
    useQuery(PRIVATE_DISTS, getPrivateAssistants, { enabled: userIsAuthorized })

  const getDist = ({ distName }: IGetDist, options?: IGetDistOptions) => {
    const isRetry = options?.retry !== undefined

    return useQuery<BotInfoInterface>({
      queryKey: [DIST, distName],
      queryFn: () => getAssistant(distName!),
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
    },
  })

  const clone = useMutation({
    mutationFn: ({ name, data }: IClone) => cloneAssistant(name, data),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.skills, { name: dist.name }))
    },
  })

  const create = useMutation({
    onMutate: data => console.log('data = ', data),
    mutationFn: (createPayload: ICreateAssistantPayload) =>
      createAssistant(createPayload),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.skills, { name: dist.name }))
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
    },
  })

  const changeVisibility = useMutation({
    onMutate: ({ name, newVisibility, deploymentState }) => {
      if (newVisibility !== VISIBILITY_STATUS.PRIVATE && !deploymentState) {
        deploy.mutateAsync(name)
      }
    },
    mutationFn: ({ name, newVisibility }: IChangeVisibility) =>
      publishAssistant(name, newVisibility),
    onSuccess: (_, { name, newVisibility, inEditor }) => {
      const requestToPublicTemplate =
        newVisibility === VISIBILITY_STATUS.PUBLIC_TEMPLATE

      if (requestToPublicTemplate) queryClient.invalidateQueries([PUBLIC_DISTS])
      if (inEditor) queryClient.invalidateQueries([DIST, name])
      queryClient
        .invalidateQueries([PRIVATE_DISTS])
        .finally(() => updateCachedDist(name))
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
    refetchDist,
  }
}
