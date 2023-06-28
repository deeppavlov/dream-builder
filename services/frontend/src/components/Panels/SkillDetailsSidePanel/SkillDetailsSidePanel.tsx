import classNames from 'classnames/bind'
import { useEffect } from 'react'
import { generatePath, useNavigate, useParams } from 'react-router-dom'
import { RoutesList } from 'router/RoutesList'
import { SkillAvailabilityType } from 'types/types'
import { usePreview } from 'context/PreviewProvider'
import { useComponent } from 'hooks/api'
import { trigger } from 'utils/events'
import { Button } from 'components/Buttons'
import { SidePanelButtons, SidePanelName } from 'components/Panels'
import { TRIGGER_RIGHT_SP_EVENT } from 'components/Panels/BaseSidePanel/BaseSidePanel'
import DumbSkillSP from 'components/Panels/SkillSidePanel/DumbSkillSP'
import s from './SkillDetailsSidePanel.module.scss'

interface Props {
  component_id: number
  distName: string
  activeTab?: 'Properties' | 'Editor'
  visibility?: SkillAvailabilityType
}

const SkillDetailsSidePanel = ({
  component_id,
  distName,
  activeTab,
  visibility,
}: Props) => {
  const { getComponent } = useComponent()
  const { data: skill } = getComponent({
    id: component_id,
    distName,
    type: 'skills',
  })
  const { name } = useParams()
  const nav = useNavigate()
  const { isPreview } = usePreview()
  const [properties, editor] = ['Properties', 'Editor']
  const isCustomizable =
    skill?.is_customizable && !isPreview && visibility !== 'public'
  const tabs = new Map([
    [properties, { name: properties }],
    [editor, { name: 'Details', disabled: !isCustomizable }],
  ])
  let cx = classNames.bind(s)

  const handleEnterTokenClick = () => trigger('AccessTokensModal', {})

  const triggerEditModal = () => {
    const isDistName = name !== undefined && name.length > 0

    if (isDistName) {
      nav(
        generatePath(RoutesList.editor.skillEditor, {
          name,
          skillId: skill?.component_id,
        })
      )
    }
  }

  // Close SidePanel if the skill was deleted
  useEffect(() => {
    if (!skill) trigger(TRIGGER_RIGHT_SP_EVENT, { isOpen: false })
  }, [skill])

  return (
    <DumbSkillSP
      skill={skill}
      tabs={tabs}
      activeTab={activeTab}
      visibility={visibility}
    >
      <div className={s.skillDetailsSidePanel}>
        <SidePanelName>{skill?.display_name}</SidePanelName>
        <ul className={s.table}>
          <li className={s.item}>
            <span className={cx('table-name')}>Generative model:</span>
            <span className={s.value}>
              {skill?.lm_service?.display_name || 'Empty'}
            </span>
          </li>
          <li className={cx('item', 'link')}>
            <Button theme='ghost' props={{ onClick: handleEnterTokenClick }}>
              Enter your personal access token here
            </Button>
          </li>
          <li className={cx('item', 'big-item')}>
            <span className={cx('table-name')}>Prompt:</span>
            <p className={cx('value', 'prompt')}>{skill?.prompt || 'Empty'}</p>
          </li>
        </ul>
        <SidePanelButtons>
          <Button
            theme='primary'
            props={{ onClick: isCustomizable && triggerEditModal }}
          >
            Edit
          </Button>
        </SidePanelButtons>
      </div>
    </DumbSkillSP>
  )
}

export default SkillDetailsSidePanel
