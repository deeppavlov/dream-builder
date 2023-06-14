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

export const useDeploy = () => {
  const queryClient = useQueryClient()
  const loc = useLocation()

  const deployments = useQuery('deployments', getDeployments, {
    enabled: loc.pathname === '/draft',
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
    onError: data => {
      console.log('error = ', data)
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
      store.remove(variables?.name + '_session') // delete existing dialog session because of agent reload
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
