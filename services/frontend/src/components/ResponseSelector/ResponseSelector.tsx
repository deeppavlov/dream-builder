import ResponseSelectorLogo from '../../assets/icons/response_selectors.svg'
import { FC } from 'react'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Skill } from '../SkillSelector/Skill'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { usePreview } from '../../Context/PreviewProvider'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import { IStackElement } from '../../types/types'
import s from './ResponseSelector.module.scss'

interface ResponseSelectorProps {
  responseSelectors: IStackElement[]
}

export const ResponseSelector: FC<ResponseSelectorProps> = ({
  responseSelectors,
}) => {
  const { isPreview } = usePreview()
  const customizable = responseSelectors?.filter(skill => skill.is_customizable)
  const nonCustomizable = responseSelectors?.filter(
    skill => !skill.is_customizable
  )

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
          <div className={s.element}>
            {customizable?.map((skill, i) => {
              return (
                <RadioButton
                  key={skill.name + i}
                  id={skill.name}
                  value={skill.name}
                  name='response_selector'
                  // checked={responseSelectors?.length === 1}
                  htmlFor={skill.name}>
                  <Skill skill={skill} isPreview={isPreview} />
                </RadioButton>
              )
            })}
          </div>
        </Accordion>
        <Accordion title='Non-customizable'>
          <div className={s.element}>
            {nonCustomizable?.map((skill, i) => {
              return (
                <RadioButton
                  key={skill.name + i}
                  id={skill.name}
                  value={skill.name}
                  name='response_selector'
                  checked={nonCustomizable?.length === 1}
                  htmlFor={skill.name}>
                  <Skill skill={skill} isPreview={isPreview} />
                </RadioButton>
              )
            })}
          </div>
        </Accordion>
      </form>
    </div>
  )
}
