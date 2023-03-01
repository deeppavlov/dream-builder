import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import GoogleSignInButton from '../GoogleSignInButton/GoogleSignInButton'
import { useAuth } from '../../context/AuthProvider'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Menu } from '../../ui/Menu/Menu'
import { Display } from './components/Display'
import { Test } from './components/Test'
import { trigger } from '../../utils/events'
import s from './Topbar.module.scss'
import { CloneButton } from '../CloneButton/CloneButton'

interface TopbarProps {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: () => void
  children?: React.ReactNode
  innerRef?: React.LegacyRef<any>
  title?: string
  viewChanger?: boolean
  tab?: 'Architecture' | 'Skills'
  name?: string
}

export const Topbar = ({
  type,
  viewHandler,
  innerRef,
  title,
  viewChanger,
  tab,
  name,
}: TopbarProps) => {
  const auth = useAuth()
  const user = auth?.user
  let cx = classNames.bind(s)

  const handleCloneBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    trigger('AssistantModal', { action: 'clone', bot: name })
  }
  switch (type) {
    case 'main':
      return (
        <div className={s.topbar} ref={innerRef}>
          <Menu type='main' />
          <div className={s.logo_area}>
            <Breadcrumbs />
          </div>
          <div className={s.btns_area}>
            <Display viewHandler={viewHandler} />
            {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
          </div>
          <ReactTooltip
            id='topbar_tooltip'
            place='bottom'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
        </div>
      )
    case 'editor':
      return (
        <>
          <div className={cx('topbar', 'editor')} ref={innerRef}>
            <Menu type='editor' />
            <div className={s.logo_area}>
              <Breadcrumbs tab={tab}>{title}</Breadcrumbs>
            </div>
            <CloneButton handler={handleCloneBtnClick} />
            <div className={s.btns_area}>
              {viewChanger && <Display viewHandler={viewHandler} />}
              <Test />
              {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
            </div>
          </div>
          <ReactTooltip
            id='topbar_tooltip'
            place='bottom'
            effect='solid'
            className={s.tooltips}
            delayShow={500}
          />
        </>
      )
    case 'dff':
      return <>DFF Topbar</>
  }

  return (
    <div className={s.topbar} ref={innerRef}>
      <Menu type='main' />
      <div className={s.logo_area}>
        <Breadcrumbs />
      </div>
      <div className={s.btns_area}>
        {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
      </div>
    </div>
  )
}
