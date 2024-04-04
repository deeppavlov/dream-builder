import classNames from 'classnames/bind'
import { useAuth } from 'context'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import store from 'store2'
import { ELOCALES_KEY } from 'types/types'
import { I18N_STORE_KEY, language } from 'constants/constants'
import { useObserver } from 'hooks/useObserver'
import { trigger } from 'utils/events'
import { BaseModal } from 'components/Modals'
import { AccessTokensModule } from 'components/Modules'
import { ChangeEmailModal } from '../ChangeEmailModal/ChangeEmailModal'
import s from './ProfileSettings.module.scss'

export enum ProfileTabs {
  account = 'account',
  tokens = 'tokens',
}
interface ProfileSettingData {
  detail: {
    tab?: ProfileTabs
  }
}
export const ProfileSettings: FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [activeTab, setActiveTab] = useState<ProfileTabs | null>(null)
  const { t } = useTranslation()
  const cx = classNames.bind(s)

  const [isOpenEmail, setIsOpenEmail] = useState<boolean>(false)

  const hendleCloseEmail = () => setIsOpenEmail(false)

  const isAccount = activeTab === ProfileTabs.account
  const isTokens = activeTab === ProfileTabs.tokens

  const auth = useAuth()
  const user = auth?.user
  const locale: ELOCALES_KEY = store(I18N_STORE_KEY)
  const currentLanguage = language()[locale]

  const handleEventUpdate = ({ detail }: ProfileSettingData) => {
    setIsOpen(prev => !prev)
    setActiveTab(detail.tab ?? ProfileTabs.account)
  }
  const handleClose = () => {
    setIsOpen(false)
    setActiveTab(null)
  }

  const handleTabClick = (tab: ProfileTabs) => setActiveTab(tab)

  const handleLanguageClick = () => trigger('ChangeLanguageModal', {})

  useObserver('ProfileSettingsModal', handleEventUpdate)

  return (
    <BaseModal
      isOpen={isOpen}
      handleClose={handleClose}
      setIsOpen={setIsOpen}
      modalClassName={s.baseModal}
    >
      <div className={s.profilesettings}>
        <div className={s.header}>
          <ul className={s.tabs}>
            <li
              className={cx(s.tab, isAccount && s.active)}
              onClick={() => handleTabClick(ProfileTabs.account)}
            >
              {t('modals.profile_settings.tabs.account.title')}
            </li>
            <li
              className={cx(s.tab, isTokens && s.active)}
              onClick={() => handleTabClick(ProfileTabs.tokens)}
            >
              {t('modals.profile_settings.tabs.tokens.title')}
            </li>
          </ul>
        </div>
        <div className={s.body}>
          {isAccount && (
            <>
              <div className={s.left}>
                <img src={user?.picture} alt='avatar' />
              </div>
              <div className={s.right}>
                <div className={s.block}>
                  <span className={s.key}>
                    {t('modals.profile_settings.tabs.account.name')}
                  </span>
                  <span className={s.value}>{user?.name}</span>
                </div>
                <div className={s.block}>
                  <span className={s.key}>
                    {t('modals.profile_settings.tabs.account.email')}
                  </span>
                  <div className={s.box}>
                    <span className={s.value}>{user?.email}</span>
                    <button onClick={() => setIsOpenEmail(true)}>
                      изменить
                    </button>
                  </div>
                </div>
                <hr />
                <div className={s.block}>
                  <span className={s.key}>
                    {t('modals.profile_settings.tabs.account.language')}
                  </span>
                  <span className={s.value}>{currentLanguage}</span>
                  <button className={s.btn} onClick={handleLanguageClick}>
                    {t('modals.profile_settings.tabs.account.change')}
                  </button>
                </div>
              </div>
            </>
          )}
          {isTokens && <AccessTokensModule />}
        </div>
        <BaseModal
          isOpen={isOpenEmail}
          handleClose={hendleCloseEmail}
          setIsOpen={setIsOpenEmail}
        >
          <ChangeEmailModal
            onClose={hendleCloseEmail}
            onContinue={hendleCloseEmail}
          />
        </BaseModal>
      </div>
    </BaseModal>
  )
}
