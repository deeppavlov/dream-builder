import classNames from 'classnames/bind'
import { ReactComponent as EditPencilIcon } from '@assets/icons/edit_pencil.svg'
import { SkillInfoInterface } from '../../types/types'
import Button from '../../ui/Button/Button'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import s from './GenerativeSkillEditor.module.scss'
import IntentList from '../IntentList/IntentList'
import { trigger } from '../../utils/events'
import { useState } from 'react'

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

interface Props {
  skill: SkillInfoInterface
  activeTab?: 'Properties' | 'Editor'
}

const GenerativeSkillEditor = ({ skill, activeTab }: Props) => {
  let cx = classNames.bind(s)
  const [prompt, setPrompt] = useState(skill.prompt ?? mockPrompt)

  const handleEditBtnClick = () => {
    // Object merge for mock prompt (need fix)
    trigger('SkillPromptModal', { skill: { ...skill, ...{ prompt } } })
  }
  const handleSaveBtnClick = () => {}

  return (
    <SkillSidePanel skill={skill} activeTab={activeTab}>
      <div className={cx('generativeSkillEditor')}>
        <div className={s.header}>
          <span className={s.name}>
            {skill?.display_name || skill?.name || 'Skill name'}
          </span>
        </div>

        <div className={cx('prompt-block')}>
          <span className={cx('prompt-label')}>Prompt:</span>
          <IntentList>
            <div className={cx('prompt')} onClick={handleEditBtnClick}>
              {prompt}
              <button>
                <EditPencilIcon className={cx('edit-pencil')} />
              </button>
            </div>
          </IntentList>
        </div>

        <div className={cx('btns')}>
          <Button
            theme='primary'
            props={{
              onClick: handleSaveBtnClick,
            }}>
            Save
          </Button>
        </div>
      </div>
    </SkillSidePanel>
  )
}

export default GenerativeSkillEditor
