import SkillSelectorLogo from '../../assets/icons/skill_selectors.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { RadioButton } from '../../ui/RadioButton/RadioButton'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Skill } from './Skill'
import s from './SkillSelector.module.scss'

export const SkillSelector = ({ skillSelectorsList }: any) => {
  console.log(skillSelectorsList)
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={SkillSelectorLogo} className={s.icon} />
            <p className={s.type}>Skill Selector</p>
          </div>
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Skill Selector' />
      <form
        onSubmit={e => {
          e.preventDefault()
        }}>
        <Accordion title='Non-customizable'>
          <div
            style={{
              backgroundColor: '#fff',
              width: '100%',
              padding: '0px 12px',
            }}>
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
            {/* <RadioButton
              id='rule_based'
              name='skill_selector'
              htmlFor='rule_based'>
              <Skill title='Rule Based' />
            </RadioButton>
            <RadioButton
              id='single_skill'
              name='skill_selector'
              htmlFor='single_skill'>
              <Skill title='Single Skill' />
            </RadioButton>
            <RadioButton
              id='multiple_skill'
              name='skill_selector'
              htmlFor='multiple_skill'>
              <Skill title='Multiple Skill' />
            </RadioButton> */}
          </div>
        </Accordion>
        {/* <Accordion title='Customizable'>
          <div style={{ padding: '0px 12px' }}>
            <RadioButton
              id='all_skill'
              name='skill_selector'
              htmlFor='all_skill'>
              <Skill title='All Skill' />
            </RadioButton>
          </div>
        </Accordion> */}
      </form>
    </div>
  )
}
