import CandidateAnnotatorsLogo from '../../assets/icons/candidate_annotators.svg'
import { KebabButton } from '../../ui/KebabButton/KebabButton'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordeon } from '../../ui/Accordeon/Accordeon'
import { Element } from './Element'
import s from './CandidateAnnotators.module.scss'

export const CandidateAnnotators = () => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={CandidateAnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Candidate Annotators</p>
          </div>
          <KebabButton />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.body}></div>
      <AddButtonStack disabled={true} text='Add Candidate Annotators' />
      <div className={s.elements}>
        <Accordeon title='Non-customizable'>
          <Element />
        </Accordeon>
      </div>
    </div>
  )
}
