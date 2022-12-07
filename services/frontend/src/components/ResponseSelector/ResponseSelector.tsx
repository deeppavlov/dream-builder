import ResponseSelectorLogo from '../../assets/icons/response_selector.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { Skill } from './Skill'
import s from './ResponseSelector.module.scss'

export const ResponseSelector = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={ResponseSelectorLogo} className={s.icon} />
            <p className={s.type}>Response Selector</p>
          </div>
          <KebabButton />
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Response Selector' />
      <Accordion title='Customizable'>
        <Skill title='Tag-& Evaluation-Based' />
      </Accordion>
      <Accordion title='Non-customizable'>
        <Skill title='Confidence Based' />
      </Accordion>
    </div>
  )
}
