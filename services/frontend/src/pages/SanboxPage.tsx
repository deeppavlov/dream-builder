import { DeployNotificationModal } from '../components/DeployModal/DeployNotificationModal'
import { Main } from '../components/Main/Main'
import { ProgressBar } from '../components/ProgressBar/ProgressBar'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { Topbar } from '../components/Topbar/Topbar'
import Button from '../ui/Button/Button'
import { Wrapper } from '../ui/Wrapper/Wrapper'
import { trigger } from '../utils/events'

export const SanboxPage = () => {
  const bot = { display_name: 'AI FAQ Assistant' }
  const handleTriggerD = () => {
    trigger('DeployModalNotification', bot)
  }
  return (
    <>
      <Topbar />
      <Sidebar />
      <Main sidebar>
        <Wrapper>
          <div
            style={{
              height: '600px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '600px',
              placeSelf: 'center',
            }}
          >
            <ProgressBar />
          </div>
        </Wrapper>
        <Button theme='primary' props={{ onClick: handleTriggerD }}>
          trigger deploy notification
        </Button>
      </Main>
      <DeployNotificationModal />
    </>
  )
}
