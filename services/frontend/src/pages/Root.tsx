import { Toaster } from 'react-hot-toast'
import { Outlet, useParams } from 'react-router-dom'
import {
  AccessTokensModal,
  ChangeLanguageModal,
  ProfileSettings,
  PublishAssistantWizard,
} from 'components/Modals'
import { Feedback } from 'components/Modals/Feedback/Feedback'
import { BaseSidePanel } from 'components/Panels'
import { Sidebar, Topbar } from 'components/Widgets'
import {
  AssistantMenuInfo,
  DeepyHelperTab,
  SettingsTab,
} from 'components/Widgets/Sidebar'

const Root = () => {
  const { name } = useParams()
  const isEditor = Boolean(name)

  return (
    <>
      <Topbar />
      {!isEditor && (
        <Sidebar>
          <div style={{ height: '100%' }}></div>
          <div
            style={{
              width: '100%',
              borderTop: '1px solid #F0F0F3',
              paddingTop: '8px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <DeepyHelperTab />
            <AssistantMenuInfo />
            <Feedback />
            <SettingsTab />
          </div>
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
