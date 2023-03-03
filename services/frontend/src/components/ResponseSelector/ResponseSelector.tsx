import ResponseSelectorLogo from '../../assets/icons/response_selectors.svg'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { FC } from 'react'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Skill } from './Skill'
import s from './ResponseSelector.module.scss'

interface ResponseSelectorProps {
  responseSelectors: []
}

export const ResponseSelector: FC<ResponseSelectorProps> = ({
  responseSelectors,
}) => {
  const submitHandler = (e: React.FormEvent) => {
    e.preventDefault()
  }

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
      <AddButtonStack disabled={true} text='Add Response Selector' />
      {responseSelectors?.map((item: { display_name: string }, i: number) => {
        return <Skill key={i} title={capitalizeTitle(item.display_name)} />
      })}
      <form onSubmit={submitHandler}>
        {/* <Accordion title='Customizable'> */}
        {/* </Accordion> */}
        {/* <Accordion title='Non-customizable'> */}
        {/* <Skill title='Confidence Based' /> */}
        {/* </Accordion> */}
      </form>
    </div>
  )
}
