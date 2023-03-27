import { useAuth } from '../context/AuthProvider'
import { Main } from '../components/Main/Main'
import { AccessTokensBanner } from '../components/AccessTokensBanner/AccessTokensBanner'
import { Banner } from '../components/Banner/Banner'
import { Toaster } from 'react-hot-toast'

export const ProfilePage = () => {
  const auth = useAuth()
  const user = auth?.user

  return (
    <>
      <Main>
        {user && <Banner name={user?.name} />}
        <AccessTokensBanner />
      </Main>
      <Toaster />
    </>
  )
}
