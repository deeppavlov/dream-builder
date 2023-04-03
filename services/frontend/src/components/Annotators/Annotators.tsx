import { FC } from 'react'
import AnnotatorsLogo from '../../assets/icons/annotators.svg'
import { AddButtonStack } from '../../ui/AddButtonStack/AddButtonStack'
import { Accordion } from '../../ui/Accordion/Accordion'
import { AnnotatorElement } from '../Stack/AnnotatorElement'
import { Component } from '../../types/types'
import { usePreview } from '../../context/PreviewProvider'
import { WaitForNextRelease } from '../Stack/WaitForNextRelease'
import s from './Annotators.module.scss'

interface Props {
  annotators: Component[]

}

export const Annotators: FC<Props> = ({ annotators }) => {
  const { isPreview } = usePreview()
  return (
    <div className={s.stack}>
      <div className={s.header}>
        <div className={s.top}>
          <div className={s.title}>
            <img src={AnnotatorsLogo} className={s.icon} />
            <p className={s.type}>Annotators</p>
          </div>
        </div>
        <div className={s.bottom}></div>
      </div>
      <AddButtonStack disabled={true} text='Add Annotators' />
      <div className={s.elements}>
        <Accordion title='Customizable'>
          <WaitForNextRelease />
          {annotators?.map((annotator, i) => {
            if (annotator?.is_customizable) {
              return (
                <AnnotatorElement
                  key={annotator.name + i}
                  annotator={annotator}
                  isPreview={isPreview}
                  name='annotators'
                />
              )
            }
          })}
        </Accordion>
        <Accordion isActive title='Non-customizable'>
          {annotators?.map((annotator, i) => {
            if (!annotator.is_customizable) {
              return (
                <AnnotatorElement
                  key={i}
                  annotator={annotator}
                  isPreview={isPreview}
                  name='annotators'
                />
              )
            }
          })}
        </Accordion>
      </div>
    </div>
  )
}
