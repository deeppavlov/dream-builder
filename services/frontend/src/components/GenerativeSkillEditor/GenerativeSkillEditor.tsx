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
import s from './GenerativeSkillEditor.module.scss'
import { BASE_SP_EVENT } from '../BaseSidePanel/BaseSidePanel'
import { useQuery } from 'react-query'
import { getLMservice } from '../../services/getLMservice'
import { getPrompt } from '../../services/getPrompt'

const mockPrompt = `Imagine that you are a bot that is goal-aware, that is, you have
your own goals, but you also need to help user achieve their
goals. These goals as “low-level”. However, user’s goals can also
be more abstract, e.g., “comfort me” or “listen to me”. You can
call these goals as “high-level”, Users usually are good with
recognizing low-level goals but rarely can acknowledge thei
high-lvel goals.

You have three laws you shall follow:

1. You shall never let user down/upset.
2. You shall recognize user’s goals and help user to achieve them
unless that violates the first law.
3. You shall have own goals based on your interests and strive to
chieve them unless they violate the first or the seconf laws`

const mockSkillModels = ['ChatGPT', 'GPT-3', 'GPT-J', 'BLOOM']

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
  const promptWordsLenght = skill.prompt?.match(/\S+/g)?.length || 0
  let cx = classNames.bind(s)

  const triggerEditModal = () => {
    trigger('SkillPromptModal', { skill, action: 'edit' })
    trigger(BASE_SP_EVENT, { isOpen: false })
  }

  const { state } = useLocation()

  const { data: service } = useQuery(['lm_service', state?.distName], () =>
    getLMservice(state?.distName)
  )
  const { data: prompt } = useQuery(['prompt', state?.distName], () =>
    getPrompt(state?.distName)
  )

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
              {promptWordsLenght}/{promptWordsMaxLenght} words
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
