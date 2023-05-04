import { useMutation, useQuery, useQueryClient } from 'react-query'
import { generatePath, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthProvider'
import { RoutesList } from '../router/RoutesList'
import { cloneAssistantDist } from '../services/cloneAssistantDist'
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
    onSuccess: (dist: BotInfoInterface) => {
      queryClient.invalidateQueries([PRIVATE_DISTS])
      updateCachedDist(dist.name, dist)
    },
  })

  const clone = useMutation({
    mutationFn: ({ name, data }: IClone) => cloneAssistantDist(name, data),
    onSuccess: (dist: BotInfoInterface) => {
      // queryClient.invalidateQueries([PRIVATE_DISTS])
      navigate(generatePath(RoutesList.editor.default, { name: dist.name }))
    },
  })

  const create = useMutation({
    mutationFn: (data: AssistantFormValues) => postAssistantDist(data),
    onSuccess: (dist: BotInfoInterface) => {
      // queryClient.invalidateQueries([PRIVATE_DISTS])
      navigate(generatePath(RoutesList.editor.default, { name: dist.name }))
    },
  })

  const changeVisibility = useMutation({
    mutationFn: ({ name, visibility }: IChangeVisibility) =>
      publishAssistantDist(name, visibility),
    onSuccess: (_, { name, visibility }) => {
      const publish = visibility === 'public_template'

      if (publish) queryClient.invalidateQueries([PUBLIC_DISTS])
      queryClient.invalidateQueries([PRIVATE_DISTS])
      updateCachedDist(name, publish ? {} : { visibility })
    },
  })

  const updateCachedDist = (
    name: string,
    newDist: Partial<BotInfoInterface>
  ) => {
    // queryClient.setQueryData<BotInfoInterface[] | undefined>(
    //   [PRIVATE_DISTS],
    //   old =>
    //     old &&
    //     old.map(dist => {
    //       return dist.name === name ? Object.assign({}, dist, newDist) : dist
    //     })
    // )

    const isCachedDist = queryClient.getQueryData([DIST, name]) !== undefined
    if (isCachedDist)
      queryClient.setQueryData<BotInfoInterface | undefined>(
        [DIST, name],
        old => old && Object.assign({}, old, newDist)
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
  }
}
