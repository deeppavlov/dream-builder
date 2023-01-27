import CandidateAnnotatorsLogo from '../../assets/icons/candidate_annotators.svg'
import { capitalizeTitle } from '../../utils/capitalizeTitle'
import { countResources } from '../../utils/countResources'
import { Kebab } from '../../ui/Kebab/Kebab'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Element } from './Element'
import s from './CandidateAnnotators.module.scss'
import { Annotator } from '../Annotators/Annotators'

interface Props {
  candidateAnnotators: [Annotator]
}

export const CandidateAnnotators: React.FC<Props> = ({
  candidateAnnotators,
}) => {
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
          <p className={s.data}>
            {(candidateAnnotators &&
              countResources(candidateAnnotators, 'ram_usage') +
                ' | ' +
                countResources(candidateAnnotators, 'gpu_usage')) ||
              '0.00 GB RAM | 0.00 GB GPU'}
          </p>
        </div>
      </div>
      <div className={s.body}></div>
      <AddButtonStack disabled={true} text='Add Candidate Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'></Accordion>
        <Accordion title='Non-customizable'>
          {candidateAnnotators?.map((item: Annotator, i: number) => {
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
