import { useMutation, useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { VisibilityStatus } from '../constants/constants'
import { useAuth } from '../context/AuthProvider'
import { RoutesList } from '../router/RoutesList'
import { cloneAssistantDist } from '../services/cloneAssistantDist'
import { deleteAssistantDist } from '../services/deleteAssistantDist'
import { getDist as fetchDist } from '../services/getDist'
import { getPrivateDists } from '../services/getPrivateDists'
import { getPublicDists } from '../services/getPublicDists'
import { postAssistantDist } from '../services/postAssistanDist'
import { publishAssistantDist } from '../services/publishUsersAssistantDist'
import { renameAssistantDist } from '../services/renameAssistantDist'
import {
  AssistantFormValues,
  BotInfoInterface,
  TDeploymentState,
  TDistVisibility,
} from '../types/types'
import { useDeploy } from './useDeploy'

interface IChangeVisibility {
  name: string
  visibility: TDistVisibility
  inEditor?: boolean
  deploymentState?: TDeploymentState
}

interface IClone {
  name: string
  data: AssistantFormValues
}

interface IRename extends IClone {}

interface IGetDist {
  distName: string
  useErrorBoundary?: boolean
  refetchOnMount?: boolean
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
  const fetchPublicDists = () => useQuery(PUBLIC_DISTS, getPublicDists)

  const fetchPrivateDists = () =>
    useQuery(PRIVATE_DISTS, getPrivateDists, { enabled: userIsAuthorized })

  const getDist = ({ distName, useErrorBoundary, refetchOnMount }: IGetDist) =>
    useQuery<BotInfoInterface>({
      queryKey: ['dist', distName],
      queryFn: () => fetchDist(distName),
      refetchOnMount: Boolean(refetchOnMount),
      refetchOnWindowFocus: true,
      initialData: () => getFetchedDist(distName),
      useErrorBoundary,
      retry: 1,
    })

  const rename = useMutation({
    mutationFn: ({ name, data }: IRename) => renameAssistantDist(name, data),
    onSuccess: (_, { name }) => {
      queryClient.invalidateQueries('dist')
      queryClient
        .invalidateQueries([PRIVATE_DISTS])
        .finally(() => updateCachedDist(name))
    },
  })

  const clone = useMutation({
    mutationFn: ({ name, data }: IClone) => cloneAssistantDist(name, data),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.skills, { name: dist.name }))
    },
  })

  const create = useMutation({
    mutationFn: (data: AssistantFormValues) => postAssistantDist(data),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.skills, { name: dist.name }))
    },
  })

  const deleteDist = useMutation({
    mutationFn: (name: string) => deleteAssistantDist(name),
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
    onMutate: ({ name, visibility, deploymentState }) => {
      if (visibility !== VisibilityStatus.PRIVATE && !deploymentState) {
        deploy.mutateAsync(name)
      }
    },
    mutationFn: ({ name, visibility }: IChangeVisibility) =>
      publishAssistantDist(name, visibility),
    onSuccess: (_, { name, visibility, inEditor }) => {
      const requestToPublicTemplate =
        visibility === VisibilityStatus.PUBLIC_TEMPLATE

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

  const getFetchedDist = (name: string) => {
    const publicDists =
      queryClient.getQueryData<BotInfoInterface[] | undefined>([
        PUBLIC_DISTS,
      ]) || []
    const privateDists =
      queryClient.getQueryData<BotInfoInterface[] | undefined>([
        PRIVATE_DISTS,
      ]) || []
    const dist = queryClient.getQueryData<BotInfoInterface | undefined>([
      DIST,
      name,
    ])
    const result = [dist, ...publicDists, ...privateDists]?.find(
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
  }
}
