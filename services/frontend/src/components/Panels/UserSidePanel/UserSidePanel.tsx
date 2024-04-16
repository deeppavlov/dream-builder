import { useUIOptions } from 'context'
import { FC, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UserInterface } from 'types/types'
import { consts } from 'utils/consts'
import { UserRoleMenu } from 'components/Menus'
import SidePanelHeader from '../SidePanelHeader/SidePanelHeader'
import s from './UserSidePanel.module.scss'

interface IProps {
  user: UserInterface
}

const UserSidePanel: FC<IProps> = ({ user }) => {
  const { setUIOption } = useUIOptions()
  const { t } = useTranslation('translation', { keyPrefix: 'sidepanels.user' })

  const dispatchTrigger = (isOpen: boolean) => {
    setUIOption({
      name: consts.ACTIVE_USER_SP_ID,
      value: isOpen ? user.id : null,
    })
  }

  useEffect(() => {
    dispatchTrigger(true)
    return () => dispatchTrigger(false)
  }, [user])

  return (
    <>
      <SidePanelHeader>
        <ul role='tablist'>
          <li role='tab' aria-selected>
            {t('details')}
          </li>
        </ul>
      </SidePanelHeader>
      <div className={s.userSidePanel}>
        <div className={s.infoContainer}>
          <div className={s.name}>
            <img className={s.img} src={user.picture} />
            <span>{user.name}</span>
          </div>
          <div className={s.string}>
            <span>{t('id')}</span>
            <span>{user.id}</span>
          </div>
          <div className={s.string}>
            <span>{t('email')}</span>
            <span>{user.email}</span>
          </div>
          <div className={s.string}>
            <span>{t('role')}</span>
            <div>
              <UserRoleMenu user={user} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default UserSidePanel
