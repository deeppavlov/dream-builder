import { FC } from 'react'
import CandidateAnnotatorsLogo from '../../assets/icons/candidate_annotators.svg'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { Component } from '../../types/types'
import { usePreview } from '../../context/PreviewProvider'
import { AnnotatorElement } from '../Stack/AnnotatorElement'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import { IStackElement } from '../../types/types'
import s from './CandidateAnnotators.module.scss'

interface Props {
  candidateAnnotators: Component[]
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
        </div>
      </div>
      <div className={s.body} />
      <AddButtonStack disabled={true} text='Add Candidate Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          <WaitForNextRelease />
          {candidateAnnotators?.map((annotator, i) => {
            if (annotator.is_customizable) {
              return (
                <AnnotatorElement
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                  name='candidate_annotators'
                />
              )
            }
          })}
        </Accordion>
        <Accordion isActive title='Non-customizable'>
          {candidateAnnotators?.map((annotator, i) => {
            if (!annotator.is_customizable) {
              return (
                <AnnotatorElement
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                  name='candidate_annotators'
                />
              )
            }
          })}
        </Accordion>
      </div>
    </div>
  )
}
