import classNames from 'classnames/bind'
import GoogleSignInButton from '../GoogleSignInButton/GoogleSignInButton'
import { useAuth } from '../../context/AuthProvider'
import { Breadcrumbs } from '../../ui/Breadcrumbs/Breadcrumbs'
import { Profile } from '../../ui/Profile/Profile'
import { Menu } from '../../ui/Menu/Menu'
import { Display } from './components/Display'
import { Test } from './components/Test'
import { subscribe, trigger, unsubscribe } from '../../utils/events'
import { CloneButton } from '../CloneButton/CloneButton'
import { BotInfoInterface } from '../../types/types'
import { useEffect, useState } from 'react'
import { SKILL_EDITOR_TRIGGER } from '../SkillPromptModal/SkillPromptModal'
import s from './Topbar.module.scss'

interface TopbarProps {
  type?: 'main' | 'editor' | 'dff'
  viewHandler?: () => void
  dialogHandler?: () => void
  children?: React.ReactNode
  innerRef?: React.LegacyRef<any>
  title?: string
  viewChanger?: boolean
  tab?: string
  name?: string
  dist?: BotInfoInterface
}

export const Topbar = ({
  type,
  viewHandler,
  dialogHandler,
  innerRef,
  title,
  viewChanger,
  tab,
  name,
  dist,
}: TopbarProps) => {
  const auth = useAuth()
  const user = auth?.user
  let cx = classNames.bind(s)

  const handleCloneBtnClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    if (!user) {
      trigger('SignInModal', {})
      return
    }
    trigger('AssistantModal', {
      action: 'clone',
      bot: { name: name, display_name: title },
    })
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
        </div>
      )
    case 'editor':
      const path = [title as string, tab as string]
      const skillEditorPath = [
        title as string,
        'Skills',
        history.state.dialogSkillName,
      ]
      const [isSkillEditor, setIsSkillEditor] = useState(false)

      const handleSkillEditorTrigger = (data: {
        detail: { isOpen: boolean }
      }) => setIsSkillEditor(data.detail.isOpen)

      useEffect(() => {
        subscribe(SKILL_EDITOR_TRIGGER, handleSkillEditorTrigger)
        return () => unsubscribe(SKILL_EDITOR_TRIGGER, handleSkillEditorTrigger)
      }, [])

      return (
        <>
          <div className={cx('topbar', 'editor')} ref={innerRef}>
            <Menu dist={dist} type='editor' />
            <div className={s.logo_area}>
              <Breadcrumbs path={isSkillEditor ? skillEditorPath : path} />
            </div>
            <CloneButton handler={handleCloneBtnClick} />
            <div className={s.btns_area}>
              {viewChanger && <Display viewHandler={viewHandler} />}
              <Test dist={dist} dialogHandler={dialogHandler} />
              {user ? <Profile auth={auth} /> : <GoogleSignInButton />}
            </div>
          </div>
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
