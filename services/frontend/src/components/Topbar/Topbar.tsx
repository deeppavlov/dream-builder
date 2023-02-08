import { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames/bind'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Menu } from '../../ui/Menu/Menu'
import { useAuth } from '../../Context/AuthProvider'
import { Notifications } from './components/Notifications'
import { Display } from './components/Display'
import { History } from './components/History'
import { Test } from './components/Test'
import { ReactComponent as ForkIcon } from '@assets/icons/fork.svg'
import { Resources } from './components/Resources'
import s from './Topbar.module.scss'
import ResourcesSidePanel from '../ResourcesSidePanel/ResourcesSidePanel'
import Button from '../../ui/Button/Button'
import { trigger } from '../../utils/events'
import { usePreview } from '../../Context/PreviewProvider'
import { capitalizeTitle } from '../../utils/capitalizeTitle'

interface TopbarProps {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: () => void
  children?: React.ReactNode
  innerRef?: React.LegacyRef<any>
  title?: string
  amount?: number | string
  viewChanger?: boolean
}

export const Topbar = ({
  type,
  viewHandler,
  innerRef,
  title,
  amount,
  viewChanger,
}: TopbarProps) => {
  const auth = useAuth()
  const user = auth?.user
  let cx = classNames.bind(s)
  useEffect(() => {
    //Render Google SignIn button
    google.accounts.id.initialize({
      /**
       * Getting `VITE_GOOGLE_CLIENT_ID` from .env file.
       * Maybe need to get `GOOGLE_CLIENT_ID` from backend
       */
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: auth?.login,
    })
    google.accounts.id.renderButton(document.getElementById('signin')!, {
      type: 'standard',
      size: 'medium',
      text: 'signin',
    })
  }, [])

  const handleCloneBtnClick = (e: any) => {
    console.log('clone wasclicked!')
    e.stopPropagation()
    trigger('CreateAssistantModal', { name: title })
  }
  const preview = usePreview().isPreview
  const cleanTitle = title && capitalizeTitle(title)
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
            {auth?.user ? (
              <Profile auth={auth} />
            ) : (
              <div id='signin' className={s.signin}></div>
            )}
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
              <Breadcrumbs />
            </div>
            <div className={s.assistantName}>{cleanTitle}</div>
            {preview && (
              <div className={s.fork}>
                <Button
                  theme={'secondary'}
                  small
                  withIcon
                  props={{ onClick: handleCloneBtnClick }}>
                  <div className={s.container}>
                    <ForkIcon />
                    <span>Clone</span>
                    {amount ?? (
                      <span className={s.circle}>{amount || '42'}</span>
                    )}
                  </div>
                </Button>
              </div>
            )}

            <div className={s.btns_area}>
              {viewChanger && <Display viewHandler={viewHandler} />}
              {/* <History /> */}
              <Resources />
              {/* <Notifications /> */}
              <Test />
              {auth?.user ? (
                <Profile auth={auth} />
              ) : (
                <div id='signin' className={s.signin}></div>
              )}
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
        <span className={s.logo} />
        <h3>Dream&nbsp;Builder</h3>
      </div>
      <div className={s.btns_area}>
        {auth?.user ? (
          <Profile auth={auth} />
        ) : (
          <div id='signin' className={s.signin}></div>
        )}
      </div>
    </div>
  )
}
