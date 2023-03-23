import { Outlet } from 'react-router-dom'
import { Topbar } from '../components/Topbar/Topbar'

const Root = () => {
  return (
    <>
      <Topbar type='main' />
      <Outlet />
    </>
  )
}

export default Root
