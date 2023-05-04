import { useMutation, useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
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
  TDistVisibility,
} from '../types/types'
import { trigger } from '../utils/events'

interface IChangeVisibility {
  name: string
  visibility: TDistVisibility
}

interface IClone {
  name: string
  data: AssistantFormValues
}

interface IRename extends IClone {}

export const useAssistants = () => {
  const auth = useAuth()
  const userIsAuthorized = !!auth?.user
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const PUBLIC_DISTS = 'publicDists'
  const PRIVATE_DISTS = 'privateDists'
  const DIST = 'dist'

  const fetchPublicDists = () => useQuery(PUBLIC_DISTS, getPublicDists)

  const fetchPrivateDists = () =>
    useQuery(PRIVATE_DISTS, getPrivateDists, { enabled: userIsAuthorized })

  const getDist = (name: string) =>
    useQuery({
      queryKey: ['dist', name],
      queryFn: () => fetchDist(name),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      initialData: () => getFetchedDist(name),
    })

  const rename = useMutation({
    mutationFn: ({ name, data }: IRename) => renameAssistantDist(name, data),
    onSuccess: (_, { name }) => {
      queryClient
        .invalidateQueries([PRIVATE_DISTS])
        .finally(() => updateCachedDist(name))
    },
  })

  const clone = useMutation({
    mutationFn: ({ name, data }: IClone) => cloneAssistantDist(name, data),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.default, { name: dist.name }))
    },
  })

  const create = useMutation({
    mutationFn: (data: AssistantFormValues) => postAssistantDist(data),
    onSuccess: (dist: BotInfoInterface) => {
      navigate(generatePath(RoutesList.editor.default, { name: dist.name }))
    },
  })

  const deleteDist = useMutation({
    mutationFn: (name: string) => deleteAssistantDist(name),
    onSuccess: (_, name) =>
      queryClient.invalidateQueries([PRIVATE_DISTS]).finally(() => {
        updateCachedDist(name)
      }),
  })

  const changeVisibility = useMutation({
    mutationFn: ({ name, visibility }: IChangeVisibility) =>
      publishAssistantDist(name, visibility),
    onSuccess: (_, { name, visibility }) => {
      const requestToPublicTemplate = visibility === 'public_template'

      if (requestToPublicTemplate) queryClient.invalidateQueries([PUBLIC_DISTS])
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
