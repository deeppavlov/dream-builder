import classNames from 'classnames/bind'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as Puzzle } from 'assets/icons/puzzle.svg'
import { RoutesList } from 'router/RoutesList'
import { TOOLTIP_DELAY } from 'constants/constants'
import { BaseToolTip } from 'components/Menus'
import s from './SkillsTab.module.scss'

interface Props {
  isActive?: boolean
}

export const SkillsTab = ({ isActive }: Props) => {
  let cx = classNames.bind(s)
  const navigate = useNavigate()
  const { name } = useParams()

  const skillsClickHandler = () => {
    navigate(generatePath(RoutesList.editor.skills, { name: name! }))
  }
  return (
    <button
      onClick={skillsClickHandler}
      data-tooltip-id='sidebarSkillTab'
      className={cx('puzzle', isActive && 'active')}
    >
      <Puzzle />
      <BaseToolTip
        delayShow={TOOLTIP_DELAY}
        id='sidebarSkillTab'
        content='Skills'
        place='right'
      />
    </button>
  )
}
