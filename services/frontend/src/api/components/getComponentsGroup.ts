import { StackType } from 'types/types'
import { api } from 'api/axiosConfig'

interface IProps {
  group: StackType
  component_type?: string
  author_id?: number
}

export async function getComponentsGroup({
  group,
  component_type,
  author_id,
}: IProps) {
  try {
    const componentType =
      component_type !== undefined ? `?component_type=${component_type}` : ''
    const authorId = author_id !== undefined ? `&author_id=${author_id}` : ''
    const { data } = await api.get(
      `components/group/${group}${componentType}${authorId}`
    )
    return data
  } catch (e) {
    throw e
  }
}
