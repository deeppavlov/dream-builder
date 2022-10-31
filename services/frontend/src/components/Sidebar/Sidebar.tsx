import s from './Sidebar.module.scss'

export const Sidebar = ({ children, sidebar, sidebar_type }: any) => {
  const sidebarTypes = {
    black: 'black',
    dff: '',
    stacks: '',
  }

  return (
    <>
      {sidebar === 'none' ? null : (
        <div
          // style={{ backgroundColor: `${sidebarTypes.black}` }}
          className={s.sidebar}>
          {children}
        </div>
      )}
    </>
  )
}
