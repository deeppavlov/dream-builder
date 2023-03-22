import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { ReactComponent as UploadIcon } from '@assets/icons/upload.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './FAQSidePanel.module.scss'
import IntentList from '../IntentList/IntentList'
import IntentListItem from '../IntentListItem/IntentListItem'
import SkillSidePanel from '../SkillSidePanel/SkillSidePanel'
import { SkillInfoInterface } from '../../types/types'

interface FAQItem {
  question: string
  answer: string
}

const faqMock: FAQItem[] = [
  {
    question: 'What is the preparatory course?',
    answer: 'The preparatory course is a special educational ',
  },
  {
    question: 'Do you have a preparatory course?',
    answer: 'The preparatory course is a special educational ',
  },
  {
    question: 'What is an invitation letter?',
    answer: 'The preparatory course is a special educational ',
  },
  {
    question: 'How can I get a visa from the Russian Embassy?',
    answer: 'The preparatory course is a special educational ',
  },
  {
    question: 'How long does it take to issue an invitation letter?',
    answer: 'The preparatory course is a special educational ',
  },
]

interface Props {
  skill: SkillInfoInterface
  activeTab?: 'Properties' | 'Editor'
  disabled?: boolean
}

const FAQSidePanel = ({ skill, activeTab, disabled }: Props) => {
  return (
    <SkillSidePanel skill={skill} activeTab={activeTab}>
      <div className={s.faqSidePanel}>
        <div className={s.name}>FAQ</div>
        <div>
          <Button theme='secondary' small long>
            <UploadIcon className={s.upload} />
            Upload
          </Button>
          <button className={s['faqSidePanel__upload-btn']}>
            Upload your own .csv file <UploadIcon />
          </button>
        </div>
        <IntentList>
          <div className={s['add-faq']}>
            <Button theme='secondary' long>
              <PlusIcon />
              FAQ
            </Button>
          </div>
          {faqMock.map(({ question, answer }, i) => (
            <IntentListItem
              key={question + i}
              id={question + i}
              name={question}
              about={answer}
            />
          ))}
        </IntentList>
        <div className={s.faqSidePanel__btns}>
          <Button theme='primary'>Train</Button>
        </div>
      </div>
    </SkillSidePanel>
  )
}

export default FAQSidePanel
