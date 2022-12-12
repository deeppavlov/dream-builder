import ResponseSelectorLogo from '../../assets/icons/response_selector.svg'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
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
      <AddButtonStack disabled='true' text='Add Response Selector' />
      <Accordeon title='Customizable'>
        <Skill title='Tag-& Evaluation-Based' />
      </Accordeon>
      <Accordeon title='Non-customizable'>
        <Skill title='Confidence Based' />
      </Accordeon>
    </div>
  )
}
