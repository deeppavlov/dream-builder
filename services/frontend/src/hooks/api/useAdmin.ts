import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useLocation } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { UserInterface } from 'types/types'
import { confirmRequest, declineRequest, getPublishRequest } from 'api/admin'
import { getUsers } from 'api/admin/getUsers'
import { setRole } from 'api/admin/setRole'
import {
  fetchFeedbackList,
  getFeedbackStatuses as fetchFeedbackStatuses,
} from 'api/feedback'
import { setFeedbackStatus } from 'api/feedback/setFeedbackStatus'

export const useAdmin = () => {
  const queryClient = useQueryClient()
  const loc = useLocation()

  const { data: requests } = useQuery('publish_requests', getPublishRequest, {
    enabled:
      loc.pathname === RoutesList.admin.default ||
      loc.pathname === RoutesList.admin.requests.slice(0, -1),
  })

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

  const { data: users } = useQuery<UserInterface[]>(['users'], getUsers, {
    enabled: loc.pathname === RoutesList.admin.users,
  })

  const changeRole = useMutation({
    mutationFn: ({ userId, roleId }: { userId: number; roleId: number }) => {
      return setRole(userId, roleId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'users' })
    },
  })

  const getFeedbackList = (
    type_id: number | null = null,
    status_id: number | null = null
  ) =>
    useQuery(['feedback_list'], () => fetchFeedbackList(type_id, status_id), {
      enabled: loc.pathname === RoutesList.admin.feedback,
    })

  const getFeedbackStatuses = () =>
    useQuery(['feedback_statuses'], () => fetchFeedbackStatuses(), {
      enabled: loc.pathname === RoutesList.admin.feedback,
    })

  const changeFeedbackStatus = useMutation({
    mutationFn: ({
      feedbackId,
      statusId,
    }: {
      feedbackId: number
      statusId: number
    }) => {
      return setFeedbackStatus(feedbackId, statusId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: 'feedback_list' })
    },
  })

  return {
    requests,
    confirm,
    decline,
    users,
    changeRole,
    getFeedbackList,
    getFeedbackStatuses,
    changeFeedbackStatus,
  }
}
