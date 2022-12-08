import AnnotatorsLogo from '../../assets/icons/annotators.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import s from './Annotators.module.scss'

export const Annotators = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={AnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Annotators</p>
          </div>
          <Kebab dataFor='all_annotators' />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <AddButtonStack disabled={true} text='Add Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          <Element />
          <Element />
        </Accordion>
        <Accordion title='Non-customizable'>
          <Element />
          <Element />
        </Accordion>
      </div>
    </div>
  )
}
