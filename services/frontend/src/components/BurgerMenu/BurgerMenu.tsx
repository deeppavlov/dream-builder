import ReactTooltip from 'react-tooltip'
import s from './BurgerMenu.module.scss'

export const BurgerMenu = () => {
  return (
    <ReactTooltip
      event='click'
      globalEventOff='click'
      arrowColor='#fff'
      clickable={true}
      className={s.burgermenu}
      offset={{ right: 90, top: -3 }}
      type='dark'
      id='burgermenu'
      place='bottom'
      effect='solid'>
      <ul className={s.menu}>
        <li className={s.item}>
          <button>Save</button>
        </li>
        <li className={s.item}>
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
        </li>
      </ul>
    </ReactTooltip>
  )
}
