import { AxiosError } from 'axios'
import { useAuth, useUIOptions } from 'context'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import store from 'store2'
import { BotInfoInterface } from 'types/types'
import { DEPLOY_STATUS, DIST } from 'constants/constants'
import {
  deleteDeploy,
  getDeploy,
  getDeployments,
  startDeploy,
} from 'api/deploy'
import { consts } from 'utils/consts'

export const useDeploy = () => {
  const queryClient = useQueryClient()
  const loc = useLocation()
  const { setUIOption } = useUIOptions()

  const { user } = useAuth()

  const deployments = useQuery('deployments', getDeployments, {
    enabled: loc.pathname === '/admin' || loc.pathname === '/admin/requests',
  })

  // TODO create undeploy method

  const deploy = useMutation({
    mutationFn: (virtual_assistant_name: string) => {
      return startDeploy(virtual_assistant_name)
    },
    onSuccess: (_, name) => {
      queryClient.invalidateQueries(['privateDists'])
      queryClient.invalidateQueries([DIST, name])
    },
    onError: (error: AxiosError<{ detail: string }>) => {
      if (
        error.response?.data.detail ===
        'You have exceeded your deployment limit for virtual assistants!'
      ) {
        setUIOption({ name: consts.TARIFFS_MODAL_IS_OPEN, value: true })
      }
    },
  })
  const deleteDeployment = useMutation({
    onMutate: bot => {
      console.log('bot = ', bot)
    },
    mutationFn: (bot: BotInfoInterface) => {
      return deleteDeploy(bot?.deployment?.id)
    },
    onSuccess: (_, variables: BotInfoInterface) => {
      const sessionName = user?.id
        ? `${variables?.name}_session_${user?.id}`
        : `${variables?.name}_session`
      store.remove(sessionName) // delete existing dialog session because of agent reload
      queryClient.invalidateQueries([DIST, variables?.name])
      queryClient?.invalidateQueries(['deployments'])
    },
    onError: data => {
      console.log('error = ', data)
    },
  })
  const checkDeployStatus = (bot: BotInfoInterface) => {
    const status = useQuery({
      queryKey: ['deploy', bot?.deployment?.id],
      queryFn: () => getDeploy(bot?.deployment?.id!),
      refetchOnMount: false,
      enabled: bot?.deployment?.id !== undefined,
      onSuccess(data) {
        data?.state === DEPLOY_STATUS.UP && //FIX
          queryClient.invalidateQueries([DIST, bot?.name])

        if (
          data?.state !== DEPLOY_STATUS.UP && //FIX
          data?.state !== null &&
          data?.error == null
        ) {
          setTimeout(() => {
            queryClient.invalidateQueries(['deploy', data?.id])
          }, 5000)
        } else if (data?.error !== null) {
          console.log('error')
        }
      },
    })
    return status
  }

  return { deploy, deleteDeployment, deployments, checkDeployStatus }
}
