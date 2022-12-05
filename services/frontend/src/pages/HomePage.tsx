import { Topbar } from '../components/Topbar/Topbar'
import { Main } from '../components/Main/Main'
import { Home } from '../components/Home/Home'

export const HomePage = () => {
  return (
    <>
      <Topbar type='home' />
      <Main sidebar='none' alignItems='center'>
        <Home />
      </Main>
    </>
  )
}
