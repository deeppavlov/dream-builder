import { Toaster } from 'react-hot-toast'
import { AccessTokensBanner } from '../components/AccessTokensBanner/AccessTokensBanner'
import { Banner } from '../components/Banner/Banner'
import { BaseSidePanel } from '../components/BaseSidePanel/BaseSidePanel'
import { Main } from '../components/Main/Main'
import { useAuth } from '../context/AuthProvider'

export const ProfilePage = () => {
  const auth = useAuth()
  const user = auth?.user

  return (
    <>
      <Main sidebar>
        {user && <Banner name={user?.name} />}
        <AccessTokensBanner />
      </Main>
      <BaseSidePanel transition='left' />
      <Toaster />
    </>
  )
}
