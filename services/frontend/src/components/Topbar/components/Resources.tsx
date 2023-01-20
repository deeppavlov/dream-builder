import { ReactComponent as Icon } from '../../../assets/icons/params.svg'
import { TotalResourcesInterface } from '../../../types/types'
import { trigger } from '../../../utils/events'
import s from './Resources.module.scss'

export const Resources = () => {
  const handleResourcesBtnClick = () => {
    const totalRes: TotalResourcesInterface = {
      proxy: {
        containers: '30',
        ram: '0.0 GB',
        gpu: '0.0 GB',
        space: '0.0 GB',
      },
      custom: {
        containers: '0',
        ram: '5.0 GB',
        gpu: '4.0 GB',
        space: '7.0 GB',
      },
    }
    trigger('ResourcesSidePanel', totalRes)
  }

  return (
    <button
      data-tip='Storage'
      data-for='topbar_tooltip'
      className={s.resources}
      onClick={handleResourcesBtnClick}>
      <Icon />
    </button>
  )
}
