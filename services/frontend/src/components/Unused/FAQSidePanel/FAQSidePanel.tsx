import { ReactComponent as PlusIcon } from 'assets/icons/plus_icon.svg'
import { ReactComponent as UploadIcon } from 'assets/icons/upload.svg'
import { Button } from 'components/Buttons'
import SkillSidePanel from 'components/Panels/SkillSidePanel/SkillSidePanel'
import IntentList from 'components/Unused/IntentList/IntentList'
import IntentListItem from 'components/Unused/IntentListItem/IntentListItem'
import s from './FAQSidePanel.module.scss'

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
  component_id: number
  distName: string
  activeTab?: 'Properties' | 'Editor'
  disabled?: boolean
}

const FAQSidePanel = ({
  component_id,
  distName,
  activeTab,
  disabled,
}: Props) => {
  return (
    <SkillSidePanel
      component_id={component_id}
      distName={distName}
      activeTab={activeTab}
    >
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
