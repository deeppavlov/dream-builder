import { useTooltip } from '../hooks/useTooltip'
import { Topbar } from '../components/Topbar/Topbar'
import { Main } from '../components/Main/Main'
import { Home } from '../components/Home/Home'
export const HomePage = () => {
  useTooltip()
  return (
    <>
      <Topbar type='home' />
      <Main sidebar='none'>
        <Home />
      </Main>
    </>
  )
}
