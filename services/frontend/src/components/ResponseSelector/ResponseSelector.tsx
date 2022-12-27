import ResponseSelectorLogo from '../../assets/icons/response_selector.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Skill } from './Skill'
import s from './ResponseSelector.module.scss'

export const ResponseSelector = ({ responseSelectorsList }: any) => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={ResponseSelectorLogo} className={s.icon} />
            <p className={s.type}>Response Selector</p>
          </div>
        </div>
      </div>
      {/* <AddButtonStack disabled={true} text='Add Response Selector' /> */}
      {responseSelectorsList?.map((item: string, i: number) => {
        return <Skill key={i} title={item} />
      })}
      {/* <Skill title='Conversational Evaluational Selector' /> */}
      <form
        onSubmit={e => {
          e.preventDefault()
        }}>
        {/* <Accordion title='Customizable'> */}
        {/* </Accordion> */}
        {/* <Accordion title='Non-customizable'> */}
        {/* <Skill title='Confidence Based' /> */}
        {/* </Accordion> */}
      </form>
    </div>
  )
}
