import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { ReactComponent as Arrow } from 'assets/icons/arrow_down.svg'
import { UserInterface } from 'types/types'
import { useAdmin } from 'hooks/api'
import { consts } from 'utils/consts'
import { sortUsers } from 'utils/sortUsers'
import { UserListItem } from '../UserListItem/UserListItem'
import s from './UserList.module.scss'

interface ISortingRule {
  parameter: 'name' | 'email' | 'role'
  isAscending: boolean
}
export const UserList = () => {
  const { users } = useAdmin()
  const cx = classNames.bind(s)
  const { t } = useTranslation('translation', {
    keyPrefix: 'admin_page.user_list',
  })

  const [sortedUsers, setSortedUsers] = useState<UserInterface[]>([])
  const [sortingRule, setSortingRule] = useState<ISortingRule>({
    parameter: 'name',
    isAscending: true,
  })

  useEffect(() => {
    const sortedList = users
      ? sortUsers([...users], sortingRule.parameter, sortingRule.isAscending)
      : []
    setSortedUsers(sortedList)
  }, [users, sortingRule])

  const changeSortingRule = (parameter: 'name' | 'email' | 'role') => {
    if (sortingRule.parameter === parameter) {
      setSortingRule(prev => ({ ...prev, isAscending: !prev.isAscending }))
    } else {
      setSortingRule({ parameter, isAscending: true })
    }
  }

  const { UIOptions } = useUIOptions()
  const isSidePanel = UIOptions[consts.RIGHT_SP_IS_ACTIVE]

  return (
    <div className={cx('container', isSidePanel && 'withSidePanel')}>
      <table className={s.table}>
        <thead>
          <tr>
            <th>
              <div
                className={s.sortableHeader}
                onClick={() => changeSortingRule('name')}
              >
                {t('name')}
                {sortingRule.parameter === 'name' && (
                  <Arrow
                    className={cx('arrow', !sortingRule.isAscending && 'up')}
                  />
                )}
              </div>
            </th>
            <th>{t('id')}</th>
            <th>
              <div
                className={s.sortableHeader}
                onClick={() => changeSortingRule('email')}
              >
                {t('email')}
                {sortingRule.parameter === 'email' && (
                  <Arrow
                    className={cx('arrow', !sortingRule.isAscending && 'up')}
                  />
                )}
              </div>
            </th>
            <th colSpan={2}>
              <div
                className={s.sortableHeader}
                onClick={() => changeSortingRule('role')}
              >
                {t('role')}
                {sortingRule.parameter === 'role' && (
                  <Arrow
                    className={cx('arrow', !sortingRule.isAscending && 'up')}
                  />
                )}
              </div>
            </th>
            <th>{t('actions')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedUsers.map(user => (
            <UserListItem key={user.id} user={user} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
