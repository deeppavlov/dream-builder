import { VisibilityStatus } from '../constants/constants'

export const visibility = [
  {
    id: 'Private',
    response: VisibilityStatus.PRIVATE,
    description: 'Private (only you can see it)',
  },
  {
    id: 'Unlisted',
    response: VisibilityStatus.UNLISTED_LINK,
    description:
      'Unlisted (only those you’ve shared the direct link can see it)',
  },
  {
    id: 'Public',
    response: VisibilityStatus.PUBLIC_TEMPLATE,
    description: 'Public Template (everyone can see it and re-use it)',
  },
]
export const visibilityForDropbox = [
  {
    name: 'Private',
    id: VisibilityStatus.PRIVATE,
    description: 'Private (only you can see it)',
  },
  {
    name: 'Unlisted',
    id: VisibilityStatus.UNLISTED_LINK,
    description:
      'Unlisted (only those you’ve shared the direct link can see it)',
  },
  {
    name: 'Public',
    id: VisibilityStatus.PUBLIC_TEMPLATE,
    description: 'Public Template (everyone can see it and re-use it)',
  },
]
