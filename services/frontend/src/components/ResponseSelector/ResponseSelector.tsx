import ResponseSelectorLogo from '../../assets/icons/response_selectors.svg'
import { FC, useId } from 'react'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Skill } from '../SkillSelector/Skill'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { usePreview } from '../../context/PreviewProvider'
import { ISkillResponder } from '../../types/types'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import s from './ResponseSelector.module.scss'

interface ResponseSelectorProps {
  responseSelectors: ISkillResponder[]
}

export const ResponseSelector: FC<ResponseSelectorProps> = ({
  responseSelectors,
}) => {
  const { isPreview } = usePreview()
  const tooltipId = useId()

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
      <form onSubmit={submitHandler}>
        <Accordion closed title='Customizable'>
          <WaitForNextRelease />
        </Accordion>
        <Accordion title='Non-customizable'>
          <div className={s.element}>
            {responseSelectors?.map((item: ISkillResponder, i: number) => {
              return (
                <>
                  <RadioButton
                    key={i}
                    id={item?.name}
                    value={item.name}
                    name='response_selector'
                    checked={responseSelectors?.length === 1}
                    htmlFor={item?.name}>
                    <Skill
                      id={tooltipId}
                      withContextMenu
                      isCustomizable={false}
                      skill={item}
                      isPreview={isPreview}
                    />
                  </RadioButton>
                </>
              )
            })}
          </div>
        </Accordion>
      </form>
    </div>
  )
}
