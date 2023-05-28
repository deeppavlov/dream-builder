import classNames from 'classnames/bind'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { TOOLTIP_DELAY } from 'constants/constants'
import { SvgIcon } from 'components/Helpers'
import { BaseToolTip } from 'components/Menus'
import s from './IntegrationTab.module.scss'

interface Props {
  isActive?: boolean
}

export const IntegrationTab = ({ isActive }: Props) => {
  let cx = classNames.bind(s)
  const navigate = useNavigate()
  const { name } = useParams()

  const integrationClickHandler = () => {
    navigate(generatePath(RoutesList.editor.integration, { name: name! }))
  }
  return (
    <button
      onClick={integrationClickHandler}
      data-tooltip-id='sidebarIntegrationTab'
      className={cx('integration', isActive && 'active')}
    >
      <SvgIcon iconName={'integration'} />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebarIntegrationTab'
        content='Integration'
        place='right'
      />
    </button>
  )
}
