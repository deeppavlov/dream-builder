import { ReactComponent as PlusIcon } from '@assets/icons/plus_icon.svg'
import { ReactComponent as UploadIcon } from '@assets/icons/upload.svg'
import { SidePanelProps } from '../../ui/SidePanel/SidePanel'
import Button from '../../ui/Button/Button'
import BaseSidePanel from '../BaseSidePanel/BaseSidePanel'
import s from './FAQSidePanel.module.scss'
import IntentList from '../IntentList/IntentList'
import IntentListItem from '../IntentListItem/IntentListItem'

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

const FAQSidePanel = ({ isOpen, setIsOpen, position }: SidePanelProps) => {
  return (
    <BaseSidePanel
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      position={position}
      name='FAQ'>
      <div className={s.faqSidePanel}>
        <div>
          <Button theme='secondary' long>
            <PlusIcon />
            FAQ
          </Button>
          <button className={s['faqSidePanel__upload-btn']}>
            Upload your own .csv file <UploadIcon />
          </button>
        </div>
        <IntentList>
          {faqMock.map(({ question, answer }, i) => (
            <IntentListItem key={question + i} name={question} about={answer} />
          ))}
        </IntentList>
        <div className={s.faqSidePanel__btns}>
          <Button theme='primary'>Train</Button>
        </div>
      </div>
    </BaseSidePanel>
  )
}

export default FAQSidePanel
