import { useMutation, useQuery, useQueryClient } from 'react-query'
import { confirmRequest } from '../services/confirmRequest'
import { declineRequest } from '../services/declineRequest'
import { getPublishRequest } from '../services/getUnreviewedPublishRequest'

export const useAdmin = () => {
  const queryClient = useQueryClient()
  const { data: requests } = useQuery('publish_requests', getPublishRequest)

  const confirm = useMutation({
    mutationFn: (data: number) => {
      return confirmRequest(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'publish_requests' })
    },
  })

  const decline = useMutation({
    mutationFn: (data: number) => {
      return declineRequest(data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'publish_requests' })
    },
  })
  return { requests, confirm, decline }
}
