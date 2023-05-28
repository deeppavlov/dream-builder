import { FC } from 'react'
import ResponseSelectorLogo from 'assets/icons/response_selectors.svg'
import { IStackElement } from 'types/types'
import { AddButtonStack } from 'components/Buttons'
import { Accordion } from 'components/Dropdowns'
import { RadioSkill } from 'components/Stacks/SkillSelector/RadioSkill'
import { WaitForNextRelease } from 'components/Stacks/WaitForNextRelease'
import s from './ResponseSelector.module.scss'

interface ResponseSelectorProps {
  responseSelectors: IStackElement[]
}

export const ResponseSelector: FC<ResponseSelectorProps> = ({
  responseSelectors,
}) => {
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
        <Accordion title='Customizable'>
          {customizable?.length > 0 ? (
            <>
              {customizable?.map((skill, i) => {
                return (
                  <RadioSkill
                    key={skill.name + i}
                    id={skill.name}
                    value={skill.name}
                    name='response_selector'
                    // checked={responseSelectors?.length === 1}
                    htmlFor={skill.name}
                    skill={skill}
                  />
                )
              })}
            </>
          ) : (
            <WaitForNextRelease />
          )}
        </Accordion>
        <Accordion isActive title='Non-customizable'>
          {nonCustomizable?.map((skill, i) => {
            return (
              <RadioSkill
                key={skill.name + i}
                id={skill.name}
                value={skill.name}
                name='response_selector'
                defaultChecked={nonCustomizable?.length === 1}
                htmlFor={skill.name}
                skill={skill}
              />
            )
          })}
        </Accordion>
      </form>
    </div>
  )
}
