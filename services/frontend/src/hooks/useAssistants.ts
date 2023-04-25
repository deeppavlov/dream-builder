import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { TRIGGER_RIGHT_SP_EVENT } from '../components/BaseSidePanel/BaseSidePanel'
import { useAuth } from '../context/AuthProvider'
import { cloneAssistantDist } from '../services/cloneAssistantDist'
import { getDist } from '../services/getDist'
import { getPrivateDists } from '../services/getPrivateDists'
import { getPublicDists } from '../services/getPublicDists'
import { postAssistantDist } from '../services/postAssistanDist'
import { renameAssistantDist } from '../services/renameAssistantDist'
import { AssistantFormValues } from '../types/types'
import { trigger } from '../utils/events'

export const useAssistants = () => {
  const auth = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { name } = useParams()
  const { state } = useLocation()
  const isTopbarButton = Boolean(name)

  const {
    data: publicDists,
    error: publicDistsError,
    isLoading: isPublicDistsLoading,
  } = useQuery('publicDists', getPublicDists)

  const {
    data: privateDists,
    error: privateDistsError,
    isLoading: isPrivateDistsLoading,
  } = useQuery('privateDists', getPrivateDists, {
    enabled: !!auth?.user,
  })
  const { data: dist } = useQuery(
    ['dist', state?.distName],
    () => getDist(state?.distName! || name),
    {
      refetchOnWindowFocus: false,
      enabled: state?.distName?.length! > 0 || name?.length! > 0,
    }
  )
  const rename = useMutation({
    mutationFn: (variables: { data: AssistantFormValues; name: string }) => {
      return renameAssistantDist(variables?.name, variables?.data)
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: 'privateDists' }),
  })

  const clone = useMutation({
    mutationFn: (variables: { data: AssistantFormValues; name: string }) => {
      return cloneAssistantDist(variables?.data, variables?.name)
    },
    onSuccess: data =>
      queryClient
        .invalidateQueries({ queryKey: 'privateDists' })
        .then(() => {
          navigate(`/${data?.name}`, {
            state: {
              preview: false,
              distName: data?.name,
              displayName: data?.display_name,
            },
          })
        })
        .then(() => {
          isTopbarButton && trigger('AssistantModal', { isOpen: false })
          trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
        }),
  })

  const create = useMutation({
    mutationFn: (data: AssistantFormValues) => {
      return postAssistantDist(data)
    },
    onSuccess: data =>
      queryClient.invalidateQueries({ queryKey: 'privateDists' }).then(() => {
        navigate(`/${data?.name}`, {
          state: {
            preview: false,
            distName: data?.name,
            displayName: data?.display_name,
          },
        })
      }),
  })
  return {
    privateDists,
    privateDistsError,
    isPrivateDistsLoading,
    publicDists,
    publicDistsError,
    isPublicDistsLoading,
    dist,
    rename,
    create,
    clone,
  }
}
