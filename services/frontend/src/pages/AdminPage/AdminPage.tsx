import { Toaster } from 'react-hot-toast'
import { Outlet, useMatch } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import {
  AccessTokensModal,
  ChangeLanguageModal,
  ProfileSettings,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container } from 'components/UI'
import { Sidebar, Topbar } from 'components/Widgets'
import { DeepyHelperTab, SettingsTab } from 'components/Widgets/Sidebar'
import { PublicationRequestsTab } from 'components/Widgets/Sidebar/PublicationRequestsTab'
import { UsersTab } from 'components/Widgets/Sidebar/UsersTab'

export const AdminPage = () => {
  const isAdminTab = Boolean(useMatch(RoutesList.admin.default))
  const isRequestsTab = Boolean(
    useMatch(RoutesList.admin.requests.slice(0, -1))
  )
  const isUsersTab = Boolean(useMatch(RoutesList.admin.users))

  return (
    <>
      <Topbar />
      <Sidebar>
        <Container layoutForTabs>
          <PublicationRequestsTab isActive={isRequestsTab || isAdminTab} />
          <UsersTab isActive={isUsersTab} />
        </Container>
        <Container layoutForBottomBtns>
          <DeepyHelperTab />
          <SettingsTab />
        </Container>
      </Sidebar>
      <Outlet />
      <Toaster />
      <BaseSidePanel />
      <ProfileSettings />
      <AccessTokensModal />
      <ChangeLanguageModal />
    </>
  )
}
