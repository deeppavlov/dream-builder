import { Toaster } from 'react-hot-toast'
import { Outlet, useParams } from 'react-router-dom'
import {
  AccessTokensModal,
  ChangeLanguageModal,
  ProfileSettings,
  PublishAssistantWizard,
} from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { Container } from 'components/UI'
import { Sidebar, Topbar } from 'components/Widgets'
import { AssistantMenuInfo, SettingsTab } from 'components/Widgets/Sidebar'

const Root = () => {
  const { name } = useParams()
  const isEditor = Boolean(name)

  return (
    <>
      <Topbar />
      {!isEditor && (
        <Sidebar>
          <div style={{ height: '100%' }}></div>
          <Container layoutForBottomBtns>
            <AssistantMenuInfo />
            <SettingsTab />
          </Container>
        </Sidebar>
      )}
      <Outlet />
      <BaseSidePanel transition='left' />
      <AccessTokensModal />
      <ChangeLanguageModal />
      <ProfileSettings />
      <Toaster />
      <PublishAssistantWizard />
    </>
  )
}

export default Root
