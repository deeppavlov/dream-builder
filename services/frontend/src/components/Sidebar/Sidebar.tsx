import ReactTooltip from 'react-tooltip'
import { SettingsTab } from './components/SettingsTab'
import s from './Sidebar.module.scss'

export const Sidebar = ({ children, sidebar, type, buttons }: any) => {
  switch (type) {
    case 'editor':
      return (
        <>
          <div className={s.sidebar}>
            <div className={s.btns_area}>
              {children}
              <ReactTooltip
                id='sidebar_tooltip'
                place='right'
                effect='solid'
                className={s.tooltips}
                delayShow={500}
              />
            </div>
            <SettingsTab />
          </div>
        </>
      )
  }
  return (
    <>
      {sidebar === 'none' ? null : <div className={s.sidebar}>{children}</div>}
    </>
  )
}
