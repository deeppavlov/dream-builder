import { useMutation, useQuery, useQueryClient } from 'react-query'
import { deleteDeploy } from '../services/deleteDeploy'
import { deleteStackById } from '../services/deleteStackById'
import { getDeploymentStack } from '../services/getDeploymentStack'
import { postDeploy } from '../services/postDeploy'

export const useDeploy = () => {
  const queryClient = useQueryClient()

  //   const status = useQuery('status', () => getDeploy(0), {
  //     refetchInterval: 500,
  //   })

  const stacks = useQuery('stacks', getDeploymentStack)
  const deploy = useMutation({
    mutationFn: (virtual_assistant_id: number) => {
      return postDeploy(virtual_assistant_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('privateDists')
    },
    onError: data => {
      console.log('error = ', data)
    },
  })
  const deleteDeployment = useMutation({
    mutationFn: (virtual_assistant_id: number) => {
      return deleteDeploy(virtual_assistant_id)
    },
    onSuccess: () => {
      console.log(`deploy delete success `)
    },
    onError: data => {
      console.log('error = ', data)
    },
  })
  const deleteStack = useMutation({
    mutationFn: (stack_id: number) => {
      return deleteStackById(stack_id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries('stacks')
    },
    onError: data => {
      console.log('error = ', data)
    },
  })

  return { deploy, deleteDeployment, deleteStack, status, stacks }
}
