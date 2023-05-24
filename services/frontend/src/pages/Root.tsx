import { Outlet, useParams } from 'react-router-dom'
import { AccessTokensModal } from '../components/AccessTokensModal/AccessTokensModal'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { DeepyHelperTab } from '../components/Sidebar/components/DeepyHelperTab'
import { SettingsTab } from '../components/Sidebar/components/SettingsTab'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'

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
    </>
  )
}

export default Root
