import { useMutation,useQuery,useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import store from 'store2'
import { deleteDeploy } from '../services/deleteDeploy'
import { getDeploy } from '../services/getDeploy'
import { getDeployments } from '../services/getDeployments'
import { postDeploy } from '../services/postDeploy'
import { BotInfoInterface } from '../types/types'
import { DEPLOY_STATUS } from './../constants/constants'

export const useDeploy = () => {
  const queryClient = useQueryClient()
  const loc = useLocation()

  const deployments = useQuery('deployments', getDeployments, {
    enabled: loc.pathname === '/draft',
  })

  // TODO create undeploy method

  const deploy = useMutation({
    mutationFn: (virtual_assistant_name: string) => {
      return postDeploy(virtual_assistant_name)
    },
    onSuccess: data => {
      queryClient.invalidateQueries('privateDists')
      queryClient.invalidateQueries('dist', data?.virtual_assistant?.name)
    },
    onError: data => {
      console.log('error = ', data)
    },
  })
  const deleteDeployment = useMutation({
    mutationFn: (bot: BotInfoInterface) => {
      return deleteDeploy(bot?.deployment?.id || bot) // '|| bot' for draft page
    },
    onSuccess: (_, variables: BotInfoInterface) => {
      store.remove(variables?.name + '_session') // delete existing dialog session because of agent reload
      queryClient.invalidateQueries('dist')
      queryClient?.invalidateQueries('deployments')
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
          queryClient.invalidateQueries(['dist', data?.virtual_assistant?.name])

        if (
          data?.state !== DEPLOY_STATUS.UP && //FIX
          data?.state !== null &&
          data?.error == null
        ) {
          setTimeout(() => {
            queryClient.invalidateQueries('deploy', data?.id)
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
