import { ReactComponent as Logo } from '../../assets/icons/generative.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import s from './SkillListItem.module.scss'

export const SkillListItem = ({ ...props }) => {
  return (
    <tr className={s.tr}>
      <td className={s.td}>
        <div className={s.name}>
          <p>convert_reddit</p>
          <span className={s.params}>RAM 60.0GB | GPU 65.0 GB | DS 300GB</span>
        </div>
      </td>
      <td className={s.td}>
        <div className={s.author}>
          <Logo />
          <p>Generative</p>
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
          <span>{props.version ? props.version : 'v.0.01'}</span>
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
          <input type='checkbox' />
          {/* <button className={s.area}> */}
          {/* </button> */}
          <div>
            <KebabButton type='row' color='#8D96B5' />
          </div>
        </div>
      </td>
    </tr>
  )
}
