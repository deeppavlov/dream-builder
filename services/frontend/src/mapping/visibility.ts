import { VISIBILITY_STATUS } from '../constants/constants'

export const visibility = [
  {
    id: 'Private',
    response: VISIBILITY_STATUS.PRIVATE,
    description: 'Private (only you can see it)',
  },
  {
    id: 'Unlisted',
    response: VISIBILITY_STATUS.UNLISTED_LINK,
    description:
      'Unlisted (only those you’ve shared the direct link can see it)',
  },
  {
    id: 'Public',
    response: VISIBILITY_STATUS.PUBLIC_TEMPLATE,
    description: 'Public Template (everyone can see it and re-use it)',
  },
]
export const visibilityForDropbox = [
  {
    name: 'Private',
    id: VISIBILITY_STATUS.PRIVATE,
    description: 'Private (only you can see it)',
  },
  {
    name: 'Unlisted',
    id: VISIBILITY_STATUS.UNLISTED_LINK,
    description:
      'Unlisted (only those you’ve shared the direct link can see it)',
  },
  {
    name: 'Public',
    id: VISIBILITY_STATUS.PUBLIC_TEMPLATE,
    description: 'Public Template (everyone can see it and re-use it)',
  },
]
