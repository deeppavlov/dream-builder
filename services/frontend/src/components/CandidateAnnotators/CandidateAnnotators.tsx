import { FC } from 'react'
import CandidateAnnotatorsLogo from '../../assets/icons/candidate_annotators.svg'
import { countResources } from '../../utils/countResources'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { usePreview } from '../../Context/PreviewProvider'
import { Element } from './Element'
import s from './CandidateAnnotators.module.scss'
import { IStackElement } from '../../types/types'

interface Props {
  candidateAnnotators: IStackElement[]
}

export const CandidateAnnotators: FC<Props> = ({ candidateAnnotators }) => {
  const { isPreview } = usePreview()

  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={CandidateAnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Candidate Annotators</p>
          </div>
          {/* <Kebab disabled dataFor='all_annotators' /> */}
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
      <div className={s.body} />
      <AddButtonStack disabled={true} text='Add Candidate Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          {candidateAnnotators?.map((annotator, i) => {
            if (annotator.is_customizable) {
              return (
                <Element
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                />
              )
            }
          })}
        </Accordion>
        <Accordion title='Non-customizable'>
          {candidateAnnotators?.map((annotator, i) => {
            if (!annotator.is_customizable) {
              return (
                <Element
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                />
              )
            }
          })}
        </Accordion>
      </div>
    </div>
  )
}
