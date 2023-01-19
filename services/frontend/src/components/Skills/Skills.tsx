import SkillsLogo from '../../assets/icons/skills.svg'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Kebab } from '../../ui/Kebab/Kebab'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Element } from './Element'
import s from './Skills.module.scss'

export const Skills = ({ skillsList }: any) => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={SkillsLogo} className={s.icon} />
            <p className={s.type}>Skills</p>
          </div>
          <Kebab dataFor='all_skills' />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>
            {skillsList?.recources || '0.00 GB RAM | 0.00 GB GPU'}
          </p>
        </div>
      </div>
      <AddButtonStack text='Add Skills' />
      <div className={s.elements}>
        <Accordion title='Customizable'></Accordion>
        <Accordion title='Non-customizable'>
          {skillsList?.map((item: string, i: number) => {
            return <Element key={i} title={capitalizeTitle(item)} />
          })}
        </Accordion>
      </div>
    </div>
  )
}
