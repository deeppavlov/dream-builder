import { Main } from '../components/Main/Main'
import { Sidebar } from '../components/Sidebar/Sidebar'
import { SwitchViewButton } from '../components/SwitchViewButton/SwitchViewButton'
import { Topbar } from '../components/Topbar/Topbar'
import { Wrapper } from '../ui/Wrapper/Wrapper'

export const SandboxPage = () => {
  return (
    <>
      <Topbar />
      <Sidebar />
      <Main sidebar>
        <Wrapper>
          <SwitchViewButton />
        </Wrapper>
      </Main>
    </>
  )
}
