import { Topbar } from '../components/Topbar/Topbar'
import { Main } from '../components/Main/Main'
import { AccessTokensBanner } from '../components/AccessTokensBanner/AccessTokensBanner'

import { Banner } from '../components/Banner/Banner'
import { useAuth } from '../Context/AuthProvider'

export const StartPage = () => {
  const auth = useAuth()
  const user = auth?.user

  return (
    <>
      <Topbar />
      <Main>
        {user && <Banner name={user?.name} />}
        <AccessTokensBanner />
      </Main>
    </>
  )
}
