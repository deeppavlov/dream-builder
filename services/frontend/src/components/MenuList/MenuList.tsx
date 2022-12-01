import ReactTooltip from 'react-tooltip'
import s from './MenuList.module.scss'

export const MenuList = () => {
  return (
    <ReactTooltip
      event='click'
      globalEventOff='click'
      arrowColor='#fff'
      clickable={true}
      className={s.menulist}
      offset={{ right: 90, top: -3 }}
      id='main_menu'
      place='bottom'
      effect='solid'>
      <ul className={s.menu}>
        <li className={s.item}>
          <button>About</button>
        </li>
        {/* <li className={s.item}>
          <button>Save As...</button>
        </li>
        <li className={s.item}>
          <button>Rename</button>
        </li>
        <hr />
        <li className={s.item}>
          <button>Project Settings</button>
        </li>
        <li className={s.item}>
          <button>Manage versions...</button>
        </li>
        <hr />
        <li className={s.item}>
          <button>Import Your Files</button>
        </li>
        <hr />
        <li className={s.item}>
          <button>Delete Your Bot</button>
        </li> */}
      </ul>
    </ReactTooltip>
  )
}
