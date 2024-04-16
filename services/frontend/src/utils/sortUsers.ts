import { UserInterface } from 'types/types'

export const sortUsers = (
  users: UserInterface[],
  param: 'name' | 'email' | 'role',
  isAscending: boolean
) => {
  return users.sort((userA, userB) => {
    const a = param === 'role' ? userA.role.name : userA[param]
    const b = param === 'role' ? userB.role.name : userB[param]

    if (!a) return isAscending ? -1 : 1
    if (!b) return isAscending ? 1 : -1

    return isAscending ? a.localeCompare(b) : b.localeCompare(a)
  })
}
