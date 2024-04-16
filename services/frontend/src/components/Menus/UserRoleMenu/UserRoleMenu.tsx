import classNames from 'classnames/bind'
import { useAuth } from 'context'
import { FC, useId } from 'react'
import toast from 'react-hot-toast'
import { useTranslation } from 'react-i18next'
import { ReactComponent as ArrowDown } from 'assets/icons/arrow_down_topbar.svg'
import { ReactComponent as Check } from 'assets/icons/checkbox_mark.svg'
import { UserInterface } from 'types/types'
import { toasts } from 'mapping/toasts'
import { useAdmin } from 'hooks/api'
import { trigger } from 'utils/events'
import { stopPropagation } from 'utils/stopPropagation'
import BaseContextMenu from '../BaseContextMenu/BaseContextMenu'
import s from './UserRoleMenu.module.scss'

const roles: { name: 'user' | 'admin' | 'moderator'; id: number }[] = [
  {
    name: 'user',
    id: 1,
  },
  {
    name: 'moderator',
    id: 2,
  },
  {
    name: 'admin',
    id: 3,
  },
]

interface IProps {
  user: UserInterface
}

const UserRoleMenu: FC<IProps> = ({ user }) => {
  const { t } = useTranslation('translation', {
    keyPrefix: 'admin_page.user_list',
  })
  const cx = classNames.bind(s)
  const { changeRole } = useAdmin()
  const auth = useAuth()
  const id = useId()

  const isAdmin = user.role.id === 3
  const isModerator = user.role.id === 2

  const changeUserRole = (id: number) => {
    toast.promise<any>(
      new Promise((resolve, reject) => {
        if (auth.user?.id === user.id) reject('selfRoleChanging')
        else resolve(changeRole.mutateAsync({ userId: user.id, roleId: id }))
      }),
      toasts().changeUserRole
    )
  }

  return (
    <>
      <button
        className={s.role}
        data-tooltip-id={`role_${id}`}
        onClick={stopPropagation}
      >
        <span className={cx(isAdmin && 'admin', isModerator && 'moderator')}>
          {t(user.role.name)}
        </span>
        <ArrowDown className={s.svg} />
      </button>
      <BaseContextMenu
        className={cx('contextMenu')}
        tooltipId={`role_${id}`}
        place='bottom'
        noArrow
      >
        {roles.map(({ name, id }) => {
          const isActive = name === user.role.name
          return (
            <div
              onClick={e => {
                e.stopPropagation()
                trigger('CtxMenuBtnClick', {})
                changeUserRole(id)
              }}
              key={id}
              className={cx('contextMenuItem')}
            >
              {t(name)}
              <div className={s.check}>{isActive && <Check />}</div>
            </div>
          )
        })}
      </BaseContextMenu>
    </>
  )
}

export default UserRoleMenu
