import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import { deleteDeploy } from '../services/deleteDeploy'
import { getDeployments } from '../services/getDeployments'
import { postDeploy } from '../services/postDeploy'

export const useDeploy = () => {
  const queryClient = useQueryClient()

  const loc = useLocation()

  const deployments = useQuery('deployments', getDeployments, {
    enabled: loc.pathname === '/draft',
  })

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
    mutationFn: (deployment_id: number) => {
      return deleteDeploy(deployment_id)
    },
    onSuccess: (_, variables) => {
      console.log('variables = ', variables)
      queryClient.invalidateQueries('dist')
      queryClient?.invalidateQueries('deployments')
    },
    onError: data => {
      console.log('error = ', data)
    },
  })

  return { deploy, deleteDeployment, deployments }
}
