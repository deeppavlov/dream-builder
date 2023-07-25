import { Toaster } from 'react-hot-toast'
import { useQueryClient } from 'react-query'
import { Outlet, useParams } from 'react-router-dom'
import { useObserver } from 'hooks/useObserver'
import 'components/Modals'
import {
  AccessTokensModal,
  AssistantModal,
  ChangeLanguageModal,
  DeleteAssistantModal,
  ProfileSettings,
  PublicToPrivateModal,
  PublishAssistantModal,
  PublishWarningModal,
  ShareAssistantModal,
  SignInModal,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container } from 'components/UI'
import { Sidebar, Topbar } from 'components/Widgets'
import { DeepyHelperTab, SettingsTab } from 'components/Widgets/Sidebar'

const RootLayout = () => {
  const { name } = useParams()
  const isEditor = Boolean(name)
  const queryClient = useQueryClient()
  useObserver('logout', () => queryClient.invalidateQueries())
  return (
    <>
      <Topbar />
      {!isEditor && (
        <Sidebar>
          <Container layoutForTabs />
          <Container layoutForBottomBtns>
            <DeepyHelperTab />
            <SettingsTab />
          </Container>
        </Sidebar>
      )}
      <Outlet />
      <BaseSidePanel />
      <BaseSidePanel transition='left' />
      <ProfileSettings />
      <AccessTokensModal />
      <ChangeLanguageModal />
      <AssistantModal />
      <DeleteAssistantModal />
      <PublishAssistantModal />
      <PublishWarningModal />
      <PublicToPrivateModal />
      <ShareAssistantModal />
      <SignInModal />
      <Toaster />
    </>
  )
}

export default RootLayout
