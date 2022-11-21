import { Settings } from './components/Settings'
import s from './Sidebar.module.scss'

export const Sidebar = ({ children, sidebar, type, buttons }: any) => {
  switch (type) {
    case 'editor':
      return (
        <>
          <div className={s.sidebar}>
            <div className={s.btns_area}>{children}</div>
            <Settings />
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
