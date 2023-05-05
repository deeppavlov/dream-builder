import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import classNames from 'classnames/bind'
import { useEffect, useState } from 'react'
import { generatePath, Link, useNavigate, useParams } from 'react-router-dom'
import { usePreview } from '../../context/PreviewProvider'
import { useComponent } from '../../hooks/useComponent'
import { RoutesList } from '../../router/RoutesList'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import getTokensLength from '../../utils/getTokensLength'
import IntentList from '../IntentList/IntentList'
import DumbSkillSP from '../SkillSidePanel/DumbSkillSP'
import s from './GenerativeSkillEditor.module.scss'

interface Props {
  component_id: number
  distName: string
  activeTab?: 'Properties' | 'Editor'
}

const GenerativeSkillEditor = ({
  component_id,
  distName,
  activeTab,
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
  const tabs = new Map([
    [properties, { name: properties }],
    [editor, { name: 'Details', disabled: isPreview }],
  ])
  const [tokensLength, setTokensLength] = useState(0)
  let cx = classNames.bind(s)

  const triggerEditModal = () => {
    const isDistName = name !== undefined && name.length > 0

    if (isDistName) {
      nav(
        generatePath(RoutesList.editor.skillEditor, {
          name,
          skillId: skill?.name,
        })
      )
    }
  }

  useEffect(() => {
    const isLMService = !!skill?.lm_service?.display_name
    const isPrompt = !!skill?.prompt

    if (!isLMService && !isPrompt) return
    setTokensLength(
      getTokensLength(skill?.lm_service?.display_name, skill?.prompt)
    )
  }, [])

  return (
    <DumbSkillSP skill={skill} tabs={tabs} activeTab={activeTab}>
      <div className={cx('generativeSkillEditor')}>
        <SidePanelName>{skill.display_name}</SidePanelName>
        <ul className={s.table}>
          <li className={s.item}>
            <span className={cx('table-name')}>Generative model:</span>
            <span className={s.value}>
              {skill?.lm_service?.display_name || 'Empty'}
            </span>
          </li>
        </ul>
        <Link to={RoutesList.profile} className={s.link}>
          Enter your personal access token here
        </Link>
        <div className={cx('prompt-block')}>
          <div className={cx('prompt-header')}>
            <span className={cx('label')}>Prompt:</span>
            <span className={cx('label', 'count')}>
              {tokensLength}/{skill?.lm_service?.max_tokens} tokens
            </span>
          </div>
          <IntentList>
            <div className={cx('prompt')} onClick={triggerEditModal}>
              {skill?.prompt}
              <button>
                <EditPencilIcon className={cx('edit-pencil')} />
              </button>
            </div>
          </IntentList>
        </div>
        <SidePanelButtons>
          <Button theme='primary' props={{ onClick: triggerEditModal }}>
            Edit
          </Button>
        </SidePanelButtons>
      </div>
    </DumbSkillSP>
  )
}

export default GenerativeSkillEditor
