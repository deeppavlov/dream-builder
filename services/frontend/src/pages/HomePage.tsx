import { Topbar } from '../components/Topbar/Topbar'
import { Main } from '../components/Main/Main'
import { Home } from '../components/Home/Home'
export const HomePage = () => {
  return (
    <>
      <Topbar type='welcome' />
      <Main sidebar='none'>
        <Home />
      </Main>
    </>
  )
}
