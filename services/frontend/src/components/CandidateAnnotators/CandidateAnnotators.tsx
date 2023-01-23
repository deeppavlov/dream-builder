import CandidateAnnotatorsLogo from '../../assets/icons/candidate_annotators.svg'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import s from './CandidateAnnotators.module.scss'

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
          <p className={s.data}>7.356 GB RAM | 0.0 GB GPU</p>
        </div>
      </div>
      <div className={s.body}></div>
      <AddButtonStack disabled={true} text='Add Candidate Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'></Accordion>
        <Accordion title='Non-customizable'>
          {candidateAnnotators?.map((item: string, i: number) => {
            return (
              <Element
                key={i}
                title={capitalizeTitle(item.display_name)}
                item={item}
              />
            )
          })}
        </Accordion>
      </div>
    </div>
  )
}
