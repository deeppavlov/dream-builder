import classNames from 'classnames/bind'
import { useUIOptions } from 'context'
import { FC, useEffect } from 'react'
import { ReactComponent as Block } from 'assets/icons/forbidden_circle.svg'
import { ReactComponent as Info } from 'assets/icons/properties.svg'
import { UserInterface } from 'types/types'
import { consts } from 'utils/consts'
import { trigger } from 'utils/events'
import { stopPropagation } from 'utils/stopPropagation'
import { Button } from 'components/Buttons'
import { UserRoleMenu } from 'components/Menus'
import { UserSidePanel } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import s from './UserListItem.module.scss'

interface IProps {
  user: UserInterface
}

export const UserListItem: FC<IProps> = ({ user }) => {
  const cx = classNames.bind(s)
  const { UIOptions } = useUIOptions()

  const sidePanelIsOpen = UIOptions[consts.ACTIVE_USER_SP_ID] === user.id

  const handleClick = () => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: !sidePanelIsOpen,
      children: <UserSidePanel user={user} />,
    })
  }

  useEffect(() => {
    trigger(TRIGGER_RIGHT_SP_EVENT, {
      isOpen: sidePanelIsOpen,
      children: <UserSidePanel user={user} />,
    })
  }, [user])

  return (
    <>
      <tr
        onClick={() => handleClick()}
        className={cx('item', sidePanelIsOpen && 'active')}
      >
        <td>
          <div className={s.name}>
            <img className={s.img} src={user.picture} />
            {user.name}
          </div>
        </td>
        <td>{user.id}</td>
        <td className={s.email}>{user.email}</td>
        <td className={s.td_role}>
          <UserRoleMenu user={user} />
        </td>
        <td className={s.space}></td>
        <td className={s.actions}>
          <div className={s.btns}>
            <Button
              props={{ onClick: stopPropagation }}
              withIcon
              small
              theme='secondary'
            >
              <Block className={s.block} />
            </Button>
            <Button withIcon small theme='secondary'>
              <Info />
            </Button>
          </div>
        </td>
      </tr>
    </>
  )
}
