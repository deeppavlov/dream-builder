import { Toaster } from 'react-hot-toast'
import { Outlet, useParams } from 'react-router-dom'
import { AccessTokensModal } from 'components/Modals'
import { BaseSidePanel } from 'components/Panels'
import { PublishWarningModal } from 'components/Unused/PublishWarningModal/PublishWarningModal'
import { Sidebar, Topbar } from 'components/Widgets'
import { DeepyHelperTab, SettingsTab } from 'components/Widgets/Sidebar'

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
            <SettingsTab />
          </div>
        </Sidebar>
      )}
      <Outlet />
      <BaseSidePanel transition='left' />
      <AccessTokensModal />
      <Toaster />
      <PublishWarningModal />
    </>
  )
}

export default Root
