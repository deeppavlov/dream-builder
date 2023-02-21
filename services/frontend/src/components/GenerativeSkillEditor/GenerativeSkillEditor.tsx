import { Link } from 'react-router-dom'
import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { SkillInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import SidePanelButtons from '../../ui/SidePanelButtons/SidePanelButtons'
import SidePanelName from '../../ui/SidePanelName/SidePanelName'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import IntentList from '../IntentList/IntentList'
import SkillDropboxSearch from '../SkillDropboxSearch/SkillDropboxSearch'
import { trigger } from '../../utils/events'

import s from './GenerativeSkillEditor.module.scss'

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

const mockSkillModels = ['ChatGPT', 'GPT-3', 'GPT-J', 'Bloom']

interface Props {
  skill: SkillInfoInterface
  activeTab?: 'Properties' | 'Editor'
}

const GenerativeSkillEditor = ({ skill, activeTab }: Props) => {
  const prompt = skill.prompt ?? mockPrompt
  const promptMaxLenght = 1500
  let cx = classNames.bind(s)

  const handleEditBtnClick = () => {
    // Object merge for mock prompt (need fix)
    trigger('SkillPromptModal', { skill: { ...skill, ...{ prompt } } })
  }
  const handleSaveBtnClick = () => {}

  return (
    <SkillSidePanel skill={skill} activeTab={activeTab}>
      <div className={cx('generativeSkillEditor')}>
        <SidePanelName>{skill?.display_name || 'Skill name'}</SidePanelName>
        <div className={cx('choose-model')}>
          <span className={cx('label')}>Generative model:</span>
          <SkillDropboxSearch
            placeholder='Choose model'
            list={mockSkillModels}
            activeItem={skill?.model}
          />
          <Link to='#' className={s.link}>
            Enter your personal access token here
          </Link>
        </div>
        <div className={cx('prompt-block')}>
          <span className={cx('label')}>Prompt:</span>
          <IntentList>
            <div className={cx('prompt')} onClick={handleEditBtnClick}>
              {prompt}
              <button>
                <EditPencilIcon className={cx('edit-pencil')} />
              </button>
            </div>
          </IntentList>
          <span className={cx('label', 'count')}>
            {prompt.length || 0}/{promptMaxLenght}
          </span>
        </div>

        <SidePanelButtons>
          <Button
            theme='primary'
            props={{
              onClick: handleSaveBtnClick,
            }}>
            Save
          </Button>
        </SidePanelButtons>
      </div>
    </SkillSidePanel>
  )
}

export default GenerativeSkillEditor
