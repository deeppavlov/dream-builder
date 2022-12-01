import AnnotatorsLogo from '../../assets/icons/annotators.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
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
          <KebabButton />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.body}></div>
      <AddButtonStack disabled={true} text='Add Annotators' />
      <div className={s.elements}>
        <Accordeon title='Customizable'>
          <Element />
          <Element />
        </Accordeon>
        <Accordeon title='Non-customizable'>
          <Element />
          <Element />
        </Accordeon>
      </div>
    </div>
  )
}
