import { Link, useLocation } from 'react-router-dom'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { ISkill } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import { RoutesList } from '../../router/RoutesList'
import { usePreview } from '../../context/PreviewProvider'
import { trigger } from '../../utils/events'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import IntentList from '../IntentList/IntentList'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { useQuery } from 'react-query'
import { getLMservice } from '../../services/getLMservice'
import { getPrompt } from '../../services/getPrompt'
import s from './GenerativeSkillEditor.module.scss'
import { useDisplay } from '../../context/DisplayContext'
import { consts } from '../../utils/consts'

interface Props {
  skill: ISkill
  activeTab?: 'Properties' | 'Editor'
}

const GenerativeSkillEditor = ({ skill, activeTab }: Props) => {
  const { isPreview } = usePreview()
  const [properties, editor] = ['Properties', 'Editor']
  const tabs = new Map([
    [properties, { name: properties }],
    [editor, { name: 'Details', disabled: isPreview }],
  ])
  const promptWordsMaxLenght = 1500
  const {options} = useDisplay()
  const activeAssistant = options.get(consts.ACTIVE_ASSISTANT)
  const { data: service } = useQuery(['lm_service', activeAssistant?.name], () =>
    getLMservice(activeAssistant?.name)
  )
  const { data: prompt } = useQuery(['prompt', activeAssistant?.name], () =>
    getPrompt(activeAssistant?.name)
  )
  let cx = classNames.bind(s)

  const getPromptWordsLenght = (prompt: string) =>
    prompt?.match(/\S+/g)?.length || 0

  const triggerEditModal = () => {
    trigger('SkillPromptModal', { skill, action: 'edit' })
    trigger(BASE_SP_EVENT, { isOpen: false })
  }

  return (
    <SkillSidePanel skill={skill} tabs={tabs} activeTab={activeTab}>
      <div className={cx('generativeSkillEditor')}>
        <SidePanelName>{skill.display_name}</SidePanelName>
        <ul className={s.table}>
          <li className={s.item}>
            <span className={cx('table-name')}>Generative model:</span>
            <span className={s.value}>{service?.display_name || 'Empty'}</span>
          </li>
        </ul>
        <Link to={RoutesList.profile} className={s.link}>
          Enter your personal access token here
        </Link>
        <div className={cx('prompt-block')}>
          <div className={cx('prompt-header')}>
            <span className={cx('label')}>Prompt:</span>
            <span className={cx('label', 'count')}>
              {getPromptWordsLenght(prompt?.text || '')}/{promptWordsMaxLenght}{' '}
              words
            </span>
          </div>
          <IntentList>
            <div className={cx('prompt')} onClick={triggerEditModal}>
              {prompt?.text}
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
    </SkillSidePanel>
  )
}

export default GenerativeSkillEditor
