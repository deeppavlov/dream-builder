import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from '../../assets/icons/dp.svg'
import { ReactComponent as Clone } from '../../assets/icons/clone.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { CheckBox } from '../../ui/Checkbox/Checkbox'
import s from './BotListItem.module.scss'

export const BotListItem = ({ checkbox, ...props }: any) => {
  console.log(checkbox)
  return (
    <tr className={s.tr}>
      {checkbox && (
        <td className={s.checkboxArea}>
          <CheckBox />
        </td>
      )}
      <td className={s.td}>
        <div className={s.name}>
          <p>Dream Virtual Assistant</p>
          <span className={s.params}>RAM 60.0GB | GPU 65.0 GB | DS 300GB</span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>
          <Logo />
          <p>DeepPavlov</p>
        </div>
      </td>
      <td className={s.td}>
        <p className={s.description}>
          Our fouray into building consumer-friendly virtual assistants. Clone
          to...
        </p>
      </td>
      <td className={s.td}>
        <div className={s.version}>
          <span>{props.version ? props.version : 'v.0.3.4'}</span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.date}>
          <p className={s.ddmmyyyy}>12.31.2022</p>
          <p className={s.time}>5:21 PM </p>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.btns_area}>
          <Link to='/editor'>
            <button className={s.area}>
              <Clone />
            </button>
          </Link>
          <div>
            <Kebab color='#8D96B5' />
          </div>
        </div>
      </td>
    </tr>
  )
}
