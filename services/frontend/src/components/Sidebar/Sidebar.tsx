import { CPU } from './components/CPU'
import { Puzzle } from './components/Puzzle'
import { Settings } from './components/Settings'
import s from './Sidebar.module.scss'

export const Sidebar = ({ children, sidebar, type }: any) => {
  switch (type) {
    case 'editor':
      return (
        <>
          <div className={s.sidebar}>
            <div className={s.btns_area}>
              <CPU />
              <Puzzle />
            </div>
            <Settings />
            {children}
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
