import CandidateAnnotatorsLogo from '../../assets/icons/candidate_annotators.svg'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import s from './CandidateAnnotators.module.scss'
import { capitalizeTitle } from '../../utils/capitalizeTitle'

export const CandidateAnnotators = ({ candidateAnnotators }: any) => {
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={CandidateAnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Candidate Annotators</p>
          </div>
          <Kebab disabled dataFor='all_annotators' />
        </div>
        <div className={s.bottom}>
          <p className={s.data}>7.356 Gb RAM | 0.0 Gb GPU</p>
        </div>
      </div>
      <div className={s.body}></div>
      <AddButtonStack disabled={true} text='Add Candidate Annotators' />
      <div className={s.elements}>
        <Accordion title='Non-customizable'>
          {candidateAnnotators?.map((item: string, i: number) => {
            return <Element key={i} title={capitalizeTitle(item)} />
          })}
        </Accordion>
      </div>
    </div>
  )
}
