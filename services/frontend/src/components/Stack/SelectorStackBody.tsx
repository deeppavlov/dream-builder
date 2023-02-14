import { Accordion } from '../../ui/Accordion/Accordion'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Skill } from '../ResponseSelector/Skill'
import s from './SelectorStackBody.module.scss'

const SelectorStackBody = () => {
  return (
    <form
      onSubmit={e => {
        e.preventDefault()
      }}>
      <Accordion title='Non-customizable'>
        <div className={s.container}>
          {!skillSelectorsList ? (
            <RadioButton
              id={'All Skills'}
              name='skill_selector'
              htmlFor={'All Skills'}
              checked={true}>
              <Skill title={'All Skills'} />
            </RadioButton>
          ) : (
            skillSelectorsList?.map((item: string, i: number) => {
              return (
                <RadioButton
                  key={i}
                  id={item}
                  name='skill_selector'
                  htmlFor={item}>
                  <Skill title={capitalizeTitle(item)} />
                </RadioButton>
              )
            })
          )}
        </div>
      </Accordion>
    </form>
  )
}
export default SelectorElement
